import { Test, TestingModule } from '@nestjs/testing';
import { QuoteRequestsService } from './quote-requests.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QuoteRequestEntity } from './entities/quote-request.entity';
import { AdminGateway } from '../../helpers/admin.gateway';
import { MailerService } from '../../libs/mailer/mailer.service';
import { NotFoundException } from '@nestjs/common';
import { QuoteRequestStatusEnum } from '../../common/enum';

describe('QuoteRequestsService', () => {
  let service: QuoteRequestsService;
  let repo: { find: jest.Mock; findOne: jest.Mock; count: jest.Mock; create: jest.Mock; save: jest.Mock; softDelete: jest.Mock };
  let gateway: { emitNewQuoteRequest: jest.Mock };
  let mailer: { sendQuoteConfirmation: jest.Mock };

  beforeEach(async () => {
    repo = {
      find: jest.fn().mockResolvedValue([]),
      findOne: jest.fn(),
      count: jest.fn().mockResolvedValue(0),
      create: jest.fn().mockImplementation((dto) => dto),
      save: jest.fn().mockImplementation((entity) => Promise.resolve({ id: '1', ...entity })),
      softDelete: jest.fn(),
    };
    gateway = { emitNewQuoteRequest: jest.fn() };
    mailer = { sendQuoteConfirmation: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteRequestsService,
        { provide: getRepositoryToken(QuoteRequestEntity), useValue: repo },
        { provide: AdminGateway, useValue: gateway },
        { provide: MailerService, useValue: mailer },
      ],
    }).compile();

    service = module.get(QuoteRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a quote request and emit notification', async () => {
      const dto = { fullName: 'John', email: 'john@test.com', description: 'New pool' };
      const result = await service.create(dto as any);
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(gateway.emitNewQuoteRequest).toHaveBeenCalled();
      expect(mailer.sendQuoteConfirmation).toHaveBeenCalledWith('john@test.com', 'John');
    });
  });

  describe('findOneById', () => {
    it('should throw NotFoundException if not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.findOneById('nonexistent')).rejects.toThrow(NotFoundException);
    });

    it('should return quote request if found', async () => {
      const mockRequest = { id: '1', fullName: 'John' };
      repo.findOne.mockResolvedValue(mockRequest);
      const result = await service.findOneById('1');
      expect(result).toEqual(mockRequest);
    });
  });

  describe('updateStatus', () => {
    it('should update status of a quote request', async () => {
      const mockRequest = { id: '1', status: QuoteRequestStatusEnum.NEW };
      repo.findOne.mockResolvedValue(mockRequest);
      repo.save.mockResolvedValue({ ...mockRequest, status: QuoteRequestStatusEnum.CONTACTED });

      const result = await service.updateStatus('1', { status: QuoteRequestStatusEnum.CONTACTED });
      expect(result.status).toBe(QuoteRequestStatusEnum.CONTACTED);
    });
  });

  describe('findPendingCount', () => {
    it('should return count of pending requests', async () => {
      repo.count.mockResolvedValue(5);
      const count = await service.findPendingCount();
      expect(count).toBe(5);
    });
  });
});
