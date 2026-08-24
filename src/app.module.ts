import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './libs/database';
import { CloudinaryModule } from './libs/cloudinary';
import { MailerModule } from './libs/mailer';
import { HelpersModule } from './helpers';
import { AuthModule } from './core/auth';
import { UsersModule } from './core/users';
import { RolesModule } from './core/roles';
import { PermissionsModule } from './core/permissions';
import { ServicesModule } from './core/services';
import { PackagesModule } from './core/packages';
import { ProjectsModule } from './core/projects';
import { ProjectCategoriesModule } from './core/project-categories';
import { TestimonialsModule } from './core/testimonials';
import { TeamModule } from './core/team';
import { ProcessStepsModule } from './core/process-steps';
import { WhyChooseUsModule } from './core/why-choose-us';
import { FaqModule } from './core/faq';
import { BlogModule } from './core/blog';
import { BlogCategoriesModule } from './core/blog-categories';
import { PagesModule } from './core/pages';
import { ContactMessagesModule } from './core/contact-messages';
import { QuoteRequestsModule } from './core/quote-requests';
import { NewsletterModule } from './core/newsletter';
import { SettingsModule } from './core/settings';
import { DashboardModule } from './core/dashboard';
import { SeederModule } from './common/seeder';
import { SeederService } from './common/seeder';
import databaseConfig from './config/database.config';
import authConfig from './config/auth.config';
import cloudinaryConfig from './config/cloudinary.config';
import mailConfig from './config/mail.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authConfig, cloudinaryConfig, mailConfig],
    }),
    DatabaseModule,
    CloudinaryModule,
    MailerModule,
    HelpersModule,
    SeederModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    ServicesModule,
    PackagesModule,
    ProjectsModule,
    ProjectCategoriesModule,
    TestimonialsModule,
    TeamModule,
    ProcessStepsModule,
    WhyChooseUsModule,
    FaqModule,
    BlogModule,
    BlogCategoriesModule,
    PagesModule,
    ContactMessagesModule,
    QuoteRequestsModule,
    NewsletterModule,
    SettingsModule,
    DashboardModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seederService: SeederService) {}

  async onModuleInit() {
    try {
      await this.seederService.seed();
    } catch (error) {
      console.error('Seeder failed:', error);
    }
  }
}
