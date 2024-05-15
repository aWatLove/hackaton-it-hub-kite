'use client';
import { ResumeByUserList } from '@/shared/models/resume.model';
import { useResumeListByUserQuery } from '@/entities/resume/model/queries';
import { Skeleton } from '@/shared/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/accordion';
import { TextHtml } from '@/shared/ui/text-html';
import { Lead, P } from '@/shared/ui/typography';
import { ReactNode } from 'react';

export const ResumeList = ({
    resumes = [],
    header,
    actions,
    itemAction,
}: ResumeByUserList & {
    header?: ReactNode;
    actions?: ReactNode;
    itemAction?: (resumeId: number) => ReactNode;
}) => {
    return (
        <div className="mt-4 border rounded-lg p-4 border rounded-lg">
            <span className="flex justify-between gap-2">
                {header}
                {actions}
            </span>
            <Accordion type="multiple">
                {resumes?.map((resume, index) => (
                    <AccordionItem value={`${resume.id}_${index}`}>
                        <AccordionTrigger className="font-semibold  flex-wrap">
                            <span className="flex flex-row gap-2 flex-wrap items-center">
                                <P className="text-lg line-clamp-1">{resume.title}</P>
                                {itemAction?.(resume.id)}
                            </span>
                        </AccordionTrigger>
                        <AccordionContent>{resume.html_info ? <TextHtml text={resume.html_info} /> : <Lead>Тут ничего нет🐒)</Lead>}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export const ResumeListCurrent = ({
    header,
    actions,
    itemAction,
}: {
    itemAction?: (resumeId: number) => ReactNode;
    header?: ReactNode;
    actions?: ReactNode;
}) => {
    const { data: resumes, isLoading } = useResumeListByUserQuery();
    if (isLoading)
        return (
            <div>
                <Skeleton />
            </div>
        );
    return <ResumeList itemAction={itemAction} actions={actions} header={header} resumes={resumes?.resumes ?? []} />;
};
