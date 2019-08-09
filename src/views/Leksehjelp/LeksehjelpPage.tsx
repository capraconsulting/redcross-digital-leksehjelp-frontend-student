import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { Option } from 'react-dropdown';
import Textarea from 'react-textarea-autosize';

//Components and styles
import { Picker } from '../../ui/components';
import '../../styles/LeksehjelpPage.less';

//Services
import { getSubjectList } from '../../services/api-service';
import { QueueMessageBuilder } from '../../services/message-service';

//Providers and reducers
import { SocketContext } from '../../providers';
import {
  addThemeAction,
  removeThemeAction,
  setIntroTextAction,
} from '../../reducers';

//Config
import { MESSAGE_TYPES } from '../../../config';

const LeksehjelpPage = (props: RouteComponentProps) => {
  const {
    socketSend,
    studentInfo,
    dispatchStudentInfo,
    roomID,
    talkyID,
  } = useContext(SocketContext);
  const [themes, setThemes] = useState<Option[]>();
  const { history } = props;

  useEffect(() => {
    getSubjectList('?isMestring=0').then(data => {
      const tmpSubject = data.find(
        subject => subject.subjectTitle === studentInfo.subject,
      );
      if (tmpSubject) {
        const tmpThemes: Option[] = tmpSubject.themes.map(theme => {
          return {
            value: theme.theme,
            label: theme.theme,
          };
        });
        if (tmpThemes) {
          setThemes(tmpThemes);
        }
      }
    });
  }, [studentInfo.subject]);

  const update = () => {
    const msg = new QueueMessageBuilder(MESSAGE_TYPES.UPDATE_QUEUE)
      .withGrade(studentInfo.grade)
      .withChatType(studentInfo.chatType)
      .withNickname(studentInfo.nickname)
      .withSubject(studentInfo.subject)
      .withThemes(studentInfo.themes)
      .withIntroText(studentInfo.introText)
      .withUniqueID(studentInfo.uniqueID)
      .withVolName(studentInfo.volName)
      .build();
    socketSend(msg.createMessage);
  };

  const openTalky = () => {
    if (talkyID) {
      window.open(`https://talky.io/${talkyID}`);
    }
  };

  const addSelectedTheme = (option: Option) => {
    dispatchStudentInfo(addThemeAction(option.value));
  };

  const removeSelectedTheme = (option: string) => {
    dispatchStudentInfo(removeThemeAction(option));
  };

  const searchString = () => {
    if (studentInfo.themes) {
      return `https://www.google.com/search?q=${
        studentInfo.subject
      },${studentInfo.themes.toString()}`;
    }
    return `https://www.google.com/search?q=${studentInfo.subject}`;
  };

  const { positionInQueue, subject, introText } = studentInfo;
  return (
    <div className="waiting-container">
      <div className="content">
        <div className="header">
          <p className="text">
            Du står nå i kø for <span className="course">{subject}</span>
          </p>
          <span className="queue">Du er nr. {positionInQueue} i køen.</span>
        </div>
        <div className="body">
          <div className="item">
            <p className="text">
              Mens du venter kan du begynne å forklare hva du lurer på.
            </p>
            <Textarea
              autoFocus
              cols={window.scrollX}
              minRows={6}
              value={introText}
              onChange={event =>
                dispatchStudentInfo(setIntroTextAction(event.target.value))
              }
            />
          </div>
          {themes && (
            <div className="item">
              <p className="text">Legg til underkategorier</p>
              <Picker
                optionList={themes}
                placeholder="Velg en kategori"
                addSelected={addSelectedTheme}
                removeSelected={removeSelectedTheme}
                selectedList={studentInfo.themes}
              />
            </div>
          )}
        </div>

        <div className="button-container">
          <button className="btn btn-submit btn-queue" onClick={update}>
            Oppdater Informasjon
          </button>
          <button
            disabled={roomID.length < 1}
            className="btn btn-submit btn-queue"
            onClick={() => {
              openTalky();
              history.push('meldinger');
            }}
          >
            Gå til chat
          </button>
        </div>

        <div className="queue-link">
          <a href={searchString()} target="_blank" rel="noopener noreferrer">
            Prøv gjerne å søke på google ved å trykke på denne linken mens du
            venter!
          </a>
        </div>
        <div className="header">
          <span className="queue">Du er nr. {positionInQueue} i køen.</span>
        </div>
      </div>
    </div>
  );
};

export default LeksehjelpPage;
