import { Global, Module } from '@nestjs/common';
import { ApplicationService } from 'core/shared/application/application.service';
import { DomainEventMediator } from 'core/shared/domain/events/domain-event.mediator';
import { IUnitOfWork } from 'core/shared/domain/repository/unit-of-work.interface';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: ApplicationService,
      useFactory: (
        uow: IUnitOfWork,
        domainEventMediator: DomainEventMediator,
      ) => {
        return new ApplicationService(uow, domainEventMediator);
      },
      inject: ['UnitOfWork', DomainEventMediator],
      // scope: Scope.REQUEST,
    },
  ],
  exports: [ApplicationService],
})
export class UseCaseModule {}
