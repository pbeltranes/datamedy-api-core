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
import { Response } from 'express';
import { CreateLeadContactDto, CreateLeadDto } from './dto/create-lead.dto';
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
    @Res() response: Response,
  ) {
    const foundLead = await this.leadService.findBy(
      'email',
      createLeadDto.email,
    );
    if (!foundLead) {
      const createdLead = await this.leadService.create(createLeadDto);
      await this.emailService.handleEmailNotifications(createdLead);
    }
    return response.status(200).send(foundLead);
  }

  @Post('/contact')
  @ApiOperation({ summary: 'Create a lead with form contact' })
  @ApiBody({ type: CreateLeadContactDto })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 200, description: 'Object found.' })
  async createContact(
    @Body() createLeadDto: CreateLeadContactDto,
    @Res() response: Response,
  ) {
    let foundLead = await this.leadService.findBy('email', createLeadDto.email);
    foundLead = foundLead ?? (await this.leadService.create(createLeadDto));
    await this.emailService.handleEmailNotifications(
      {
        ...foundLead,
        name: createLeadDto.name,
        contactType: createLeadDto.contactType,
      },
      createLeadDto.message,
    );

    return response.status(200).send(foundLead);
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
