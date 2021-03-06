import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemPanel,
  AccordionItemButton,
} from 'react-accessible-accordion';

//Styles
import '../../../styles/QAList.less';

//Interfaces
import { IQuestion } from '../../../interfaces';

//Services
import { NorwegianDate } from '../../../services/date-service';
import { studentGradeFormat } from '../../../services/util-service';

interface IProps {
  questions: IQuestion[];
  totalHits: number;
  history;
}

export const SectionQAList = (props: IProps) => {
  /*This array can be null (before we fetch it)*/
  const { questions, totalHits, history } = props;

  //Temporary to render upcoming feature
  return questions && questions.length > 0 ? (
    <div>
      <div className="resultStatus">Søket ditt ga {totalHits} svar</div>
      <Accordion allowZeroExpanded={true}>
        {questions.map(
          ({
            id,
            title,
            themes,
            subject,
            studentGrade,
            answerDate,
            questionText,
            answerText,
          }) => {
            return (
              <AccordionItem key={`question-${id}`}>
                <AccordionItemHeading>
                  <AccordionItemButton>
                    <a className="qa-list-header">{title} </a>
                    {/*question title*/}
                    <div className="subject--list">
                      {themes.map(({ theme }, index) => (
                        <div
                          key={index}
                          className="subject--list-element subject--list-element-right"
                        >
                          <p>{theme}</p>
                        </div>
                      ))}
                    </div>
                    <p>
                      {subject}, {studentGradeFormat(studentGrade)}
                      {answerDate && ', ' + NorwegianDate(answerDate)}
                    </p>
                  </AccordionItemButton>
                </AccordionItemHeading>
                <AccordionItemPanel>
                  <p>
                    {/*Question content*/}
                    {questionText}
                  </p>

                  <hr />

                  <div
                    dangerouslySetInnerHTML={{
                      __html: answerText ? answerText : '<p>No answer<p>',
                    }}
                  ></div>
                  <p
                    onClick={() => history.push(`/questions/public/${id}`)}
                    className="plink"
                  >
                    Les mer...
                  </p>
                </AccordionItemPanel>

                <div className="underline"></div>
              </AccordionItem>
            );
          },
        )}
      </Accordion>
    </div>
  ) : (
    <div className="resultStatus">Søket ditt ga ingen svar</div>
  );
};

export default SectionQAList;
