import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Student } from './entities/student.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.studentRepository.findOne({ where: { email: registerDto.email } });
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(registerDto.password, salt);

    const student = this.studentRepository.create({
      full_name: registerDto.full_name,
      email: registerDto.email,
      password_hash: passwordHash,
      institution_id: registerDto.institution_id,
    });

    await this.studentRepository.save(student);

    const payload = { email: student.email, sub: student.id };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: student, 
    };
  }

  async login(loginDto: LoginDto) {
    const student = await this.studentRepository.findOne({ where: { email: loginDto.email } });
    if (!student) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(loginDto.password, student.password_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: student.email, sub: student.id };

    return {
      access_token: this.jwtService.sign(payload),
      user: student,
    };
  }
}
