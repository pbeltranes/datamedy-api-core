import { ZodValidationPipe } from '@anatine/zod-nestjs';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UsePipes,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LeadService } from './lead.service';
import { SendGridService } from '@/providers/mailer/sendgrid.service';

@ApiTags('Leads')
@Controller('lead')
@UsePipes(ZodValidationPipe)
export class LeadController {
  constructor(
    private readonly leadService: LeadService,
    private readonly emailService: SendGridService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a lead' })
  @ApiBody({ type: CreateLeadDto })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 200, description: 'Object found.' })
  async create(
    @Body() createLeadDto: CreateLeadDto,
    @Res() reply: FastifyReply,
  ) {
    const foundLead = await this.leadService.findBy(
      'email',
      createLeadDto.email,
    );

    if (foundLead) {
      return reply.status(200).send({
        message: 'Object found',
        data: foundLead,
      });
    }

    const lead = await this.leadService.create(createLeadDto);
    await this.emailService.handleEmailNotifications(lead);

    return lead;
  }

  @Patch(':email')
  update(@Param('email') email: string) {
    return this.leadService.update(email);
  }

  //  INTERNAL USE ONLY
  @ApiOperation({ summary: 'INTERNAL USE ONLY' })
  @Get()
  findAll() {
    return this.leadService.findAll();
  }
}
