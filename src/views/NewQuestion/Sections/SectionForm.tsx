import React, { useState, useEffect } from 'react';
import Dropdown, { Option } from 'react-dropdown';

//Material UI Core
import Typography from '@material-ui/core/Typography';

//Interfaces
import { IQuestion, ISubject, IModal } from '../../../interfaces';

//Services
import { postQuestion, getSubjectList } from '../../../services/api-service';

//Styles
import '../../../styles/QAForm.less';

//Components
import { SimpleModal } from '../../../ui/components';

//Persistent grade list
import gradeList from '../../../grades';

const defaultOptions = {
  value: '',
  label: '',
};

const SectionForm = () => {
  const [subjects, setSubjects] = useState([] as ISubject[]);
  const [email, setEmail] = useState('' as string);
  const [questionText, setQuestionText] = useState('' as string);
  const [subject, setSubject] = useState(defaultOptions as Option);
  const [theme, setTheme] = useState(defaultOptions as Option);
  const [studentGrade, setGrade] = useState(defaultOptions as Option);
  const [isPublic, setIsPublic] = useState(true as boolean);

  useEffect(() => {
    getSubjectList().then(setSubjects);
  }, []);

  const handleSubmit = () => {
    const questionForm: IQuestion = {
      email,
      studentGrade: Number(studentGrade.value),
      subjectID: Number(subject.value),
      themeID: Number(theme.value),
      questionText,
      isPublic,
      totalRows: 0,
    };
    postQuestion(questionForm).then(res => console.log(res));
  };

  const getSubjectOptions = (): Option[] => {
    let subjectOptions: Option[] = [];
    subjects &&
      subjects.map(subject => {
        subjectOptions.push({
          value: subject.id.toString(),
          label: subject.subjectTitle,
        });
      });
    return subjectOptions;
  };

  const getThemeOptions = (): Option[] => {
    const chosenSubject =
      subjects && subjects.filter(c => c.subjectTitle === subject.label)[0]; // Will always only be one entry in array
    if (chosenSubject) {
      return chosenSubject.themes.map(theme => {
        return {
          value: theme.id.toString(),
          label: theme.theme,
        };
      });
    } else return [];
  };

  const getGradeOptions = (): Option[] => {
    return gradeList.map(grade => {
      return {
        value: grade.gradeID,
        label: grade.label,
      };
    });
  };

  const formControls = () => {
    return (
      email.length < 1 ||
      questionText.length < 1 ||
      subject.value.length < 1 ||
      studentGrade.value.length < 1 ||
      theme.value.length < 1
    );
  };

  interface IContent {
    email;
    method;
  }

  const ModalContent = (props: IContent) => {
    return (
      <div>
        <Typography variant="h6" id="modal-title">
          Er dette din epostadresse?
        </Typography>
        <input
          placeholder={'Skriv e-postadressen din'}
          className={'email'}
          value={props.email}
          onChange={event => props.method(event.target.value)}
          type="email"
          name={'email'}
          key={1}
        />
        <button
          className="btn btn-submit"
          disabled={email.length < 1}
          onClick={() => handleSubmit()}
        >
          Ja, send spørsmål
        </button>
      </div>
    );
  };

  return (
    <div className={'form-container'}>
      <form className={'form'} onSubmit={handleSubmit}>
        <div className="form--input-container">
          {' '}
          {/*input container start*/}
          <label className={'form--label'}>Tema</label>
          <Dropdown
            placeholder={'Velg fag'}
            options={getSubjectOptions()}
            value={subject.value && subject}
            onChange={event =>
              setSubject({ value: event.value, label: event.label })
            }
          />
          <Dropdown
            disabled={!subject.value}
            placeholder={'Velg undertema'}
            options={getThemeOptions()}
            value={theme.value && theme}
            onChange={event =>
              setTheme({ value: event.value, label: event.label })
            }
          />
          <label className={'form--label'}>Klassetrinn</label>
          <Dropdown
            placeholder={'Velg klassetrinn'}
            options={getGradeOptions()}
            value={studentGrade.value && studentGrade}
            onChange={event =>
              setGrade({ value: event.value, label: event.label })
            }
          />
          <label className={'form--label'}>Spørsmål</label>
          <textarea
            placeholder={
              'Beskriv med egne ord hva du lurer på, og forklar gjerne hva det er du har kommet fram til på egenhånd.'
            }
            className={'textarea'}
            value={questionText}
            onChange={event => setQuestionText(event.target.value)}
          />
          <label className={'form--label'}>E-post</label>
          <input
            placeholder={'Skriv e-postadressen din'}
            className={'email'}
            value={email}
            onChange={event => setEmail(event.target.value)}
            type="email"
            name={'email'}
            key={1}
          />
          <div className={'anon'}>
            <label>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
              />
              Dere kan poste spørsmålet og svaret mitt på digitalleksehjelp.no
            </label>
          </div>
        </div>
        {/*Input container end*/}
      </form>
      <SimpleModal
        content={<ModalContent method={setEmail} email={email} />}
        buttonText={'Send'}
        disabled={formControls()}
      ></SimpleModal>
    </div>
  );
};

export default SectionForm;