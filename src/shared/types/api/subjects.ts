import type { SubjectCode } from '@/shared/types/api/rounds';

export interface SubjectDto {
  id: string;
  code: SubjectCode;
  name: string;
  icon?: string;
  sortOrder: number;
}

export interface SubjectsResponse {
  subjects: SubjectDto[];
}

export interface ParentSubjectDto extends SubjectDto {
  isActive: boolean;
  parentApproved: boolean;
}

export interface ParentSubjectsResponse {
  subjects: ParentSubjectDto[];
}
