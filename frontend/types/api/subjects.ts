export interface Subject {
  id: string;
  subjectName: string;
  subjectAbbrev: string;
}

export interface CreateEditSubject {
  subjectName: string;
  subjectAbbrev: string;
}
