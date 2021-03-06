import React from 'react';

//Styles
import '../../../styles/QuestionPage.less';

interface IProps {
  studentGrade: string;
  questionText: string;
}

export const SectionQuestion = (props: IProps) => {
  const { questionText, studentGrade } = props;
  return (
    <div className="question">
      <p className="showAnswer--info">
        {' '}
        {'Spørmsålet er stilt av en elev i ' + studentGrade + '.'}
      </p>
      <p id="singleQuestion">{questionText}</p>
    </div>
  );
};

export default SectionQuestion;
