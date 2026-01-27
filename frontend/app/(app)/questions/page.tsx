"use client";

import { Fragment, useState } from "react";
import { deleteQuestion, getQuestions } from "@/api/questions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, HelpCircle, ChevronDown, ChevronUp, CheckCircle2, ListChecks, Type } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function QuestionsPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["questions"],
    queryFn: getQuestions,
  });

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteQuestion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questions"] });
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="py-6 md:py-10 space-y-6 w-[98%] md:w-[95%] mx-auto">
      <div className="flex justify-between items-center border-b pb-6 px-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2 md:gap-3">
            <HelpCircle className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            Správa otázok
          </h1>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="default" className="md:h-12 md:px-6 gap-2 font-semibold shadow-md">
              <Plus className="h-5 w-5" /> 
              <span className="hidden sm:inline">Pridať otázku</span>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2 shadow-xl border-2">
            <DropdownMenuItem onClick={() => router.push("/questions/add/abcd")} className="flex items-center gap-3 p-3 cursor-pointer">
              <div className="bg-blue-100 p-2 rounded-md"><ListChecks className="h-4 w-4 text-blue-600" /></div>
              <div className="flex flex-col"><span className="font-bold text-sm">ABCD Otázka</span></div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/questions/add/writing")} className="flex items-center gap-3 p-3 cursor-pointer mt-1">
              <div className="bg-orange-100 p-2 rounded-md"><Type className="h-4 w-4 text-orange-600" /></div>
              <div className="flex flex-col"><span className="font-bold text-sm">Writing Otázka</span></div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="border rounded-xl bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/80">
            <TableRow>
              <TableHead className="w-[40px] md:w-[50px]"></TableHead>
              <TableHead className="hidden md:table-cell w-[180px] font-bold">Predmet</TableHead>
              <TableHead className="font-bold">Text otázky</TableHead>
              <TableHead className="hidden md:table-cell w-[120px] font-bold text-center">Typ</TableHead>
              <TableHead className="w-[100px] md:w-[120px] text-right font-bold">Akcie</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((question: any) => {
              const isExpanded = !!expandedRows[question.id];
              return (
                <Fragment key={question.id}>
                  <TableRow className={cn("hover:bg-slate-50/50 transition-colors", isExpanded && "bg-slate-50/30")}>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => toggleRow(question.id)} className="h-8 w-8 cursor-pointer">
                        {isExpanded ? <ChevronUp className="h-4 w-4 text-primary" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-none mb-1">{question.subject.subjectAbbrev}</span>
                        <span className="text-[11px] text-muted-foreground font-medium truncate max-w-[150px]">
                          {question.subject.subjectName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-slate-700 py-4">
                      <div className="md:hidden text-[10px] font-bold text-primary uppercase mb-1">
                        {question.subject.subjectAbbrev} • {question.questionType}
                      </div>
                      <div className="line-clamp-2 md:line-clamp-none">
                        {question.questionText}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-center">
                      <Badge className="font-bold shadow-none" variant={question.questionType === "Abcd" ? "default" : "secondary"}>
                        {question.questionType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-2 md:px-4">
                      <div className="flex justify-end gap-1 md:gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => router.push(`/questions/edit/${question.id}/${question.questionType.toLowerCase()}`)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="h-8 w-8 cursor-pointer" 
                          onClick={() => confirm("Zmazať?") && deleteMutation.mutate(question.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  {isExpanded && (
                    <TableRow className="bg-slate-50/30 hover:bg-slate-50/30">
                      <TableCell colSpan={5} className="p-2 md:p-4 border-t">
                        <div className="bg-white border rounded-xl p-3 md:p-5 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200">
                          <div className="md:hidden mb-4 pb-2 border-b flex justify-between items-end">
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase">Predmet</span>
                              <span className="text-sm font-bold">{question.subject.subjectName}</span>
                            </div>
                            <Badge variant="outline">{question.questionType}</Badge>
                          </div>

                          <h4 className="text-[10px] font-bold text-muted-foreground mb-3 uppercase tracking-widest flex items-center gap-2">
                            <HelpCircle className="h-3 w-3" /> Odpovede a riešenie
                          </h4>
                          
                          {question.questionType === "Abcd" ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
                              {question.abcdAnswers?.map((ans: any) => (
                                <div key={ans.id} className={cn(
                                  "flex items-center justify-between p-2 md:p-3 border rounded-lg",
                                  ans.isRight ? "bg-green-50 border-green-200 ring-1 ring-green-100" : "bg-slate-50/50 border-slate-200"
                                )}>
                                  <span className={cn("text-xs md:text-sm", ans.isRight ? "font-bold text-green-700" : "text-slate-600")}>
                                    {ans.answer}
                                  </span>
                                  {ans.isRight && <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-600" />}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-3 md:p-4 bg-blue-50 border border-blue-100 rounded-lg flex flex-col gap-1">
                              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Správna odpoveď</span>
                              <span className="text-sm text-blue-700 font-mono font-bold break-all">{question.answer}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}