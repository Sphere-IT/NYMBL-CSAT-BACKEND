import { Test, TestingModule } from '@nestjs/testing';
import { AssignmentResolver } from './assignment.resolver';
import { AssignmentService } from './assignment.service';

describe('AssignmentResolver', () => {
  let resolver: AssignmentResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssignmentResolver, AssignmentService],
    }).compile();

    resolver = module.get<AssignmentResolver>(AssignmentResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
