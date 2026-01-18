export interface SubjectDto {
  id: string;
  subjectName: string;
  subjectAbbrev: string;
}

export interface CreateEditSubjectDto {
  subjectName: string;
  subjectAbbrev: string;
}
