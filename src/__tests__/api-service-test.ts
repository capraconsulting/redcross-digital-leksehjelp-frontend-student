import { mocked } from 'ts-jest/utils';
import axios from 'axios';
import { IQuestion } from '../interfaces';
import {
  getQuestionList,
  getSubjectList,
  postFeedback,
  postQuestion,
} from '../services/api-service';

beforeAll(() => {
  mocked(axios.create().post).mockReset();
});

describe('api-service', () => {
  /*it('TEST: getQuestion \n Should return question with id=1', async () => {
    const question = await getQuestion('questions/1');
    expect(question.data.id).toEqual(1);
  });*/

  it('TEST: getSubjectList \n Should return list of subjects', async () => {
    const subjectList = await getSubjectList('');
    expect(subjectList.length).toBeGreaterThanOrEqual(1);
  });

  it('TEST: getQuestionList \n Should return list of questions', async () => {
    const questionList = await getQuestionList('');
    expect(questionList.length).toBeGreaterThanOrEqual(1);
  });

  /*it('TEST: getQuestion \n Should return question', async () => {
    const question = await getQuestion('question/0');
    expect(question.data).toEqual({
      id: 0,
      title: 'Question 1',
      question:
        'Hei, jeg har kommet opp i skriftlig engelsk eksamen og lurte på om dere har noen tips til meg om hvorfdan jeg bør foreberede meg. Jeg ligger på en 4 og vil veldig gjerne ha en 5-6 på eksamen. Nå har jeg to uker på meg for å forberede meg. Læreren min kommenterer på gamle innleveringer at jeg må øve mer på verb i entall og flertall. Og at jeg må ha er større ordforråd, tekstene min kommuniserer greit og at jeg nå ha sterkere argumenter. Hvordan kan jeg øve på dette?',
      answer:
        'Hei og takk for at du bruker Digital Leksehjelp! Hormonsystemet er et av systemene som kroppen bruker for å overføre informasjon, sende signaler mellom alle delene av kroppen.\n\nDu kjenner også til nervesystemet.\n\nI motsetning til nervesystemet, som er veldig kjapt men der signalene ikke varer lenge, kan hormonsystemet sende signaler, informasjon som varer lenge.\n\nHormoner produseres  hovedsaklig av kjertler som skjoldkjertelen eggstokker og testikler, binyrene, hypofysen og bukspyttkjertelen.\n\nHormonene, signalstoff kan deles inn to grupper: vannløselige og fettløselige.\n\nVannløselige hormoner produseres i celler i hormonproduserende kjertler.\n\nDe lagres inni vesikler i cellene.\n\nDe er vannløselige, dvs at de er polare og kan derfor ikke passere cellemembranen fritt.\n\nDerfor kreves en eksocytose for at hormonene kan slippes i blodstrømmen.\n\nFettløselige hormoner kan passere cellemembranen, derfor trenger de ikke å slippes ut med eksocytose og dermed trenger man ikke oppbevare dem i vesikler.\n\nDerfor kan disse hormonene produseres ved behov.\n\nSiden de er fettløselige kan de klumpe seg sammen i blodet, derfor vil de fraktes med transportproteiner, proteinkomplekser som de fettløselige hormonene kan binde seg til.\n\nHormonene fraktes med blodet til målcellen, cellen som har reseptorer som kan gjenkjenne og binde seg til hormonene.\n\nEtter at hormonene har utført sin funksjon, sendt sin informasjon, vil de brytes ned.\n\nTa gjerne en titt på videoen fra NHI som forklarer temaet nærmere.',
      class: '10. klasse',
      date: '15.06.19',
      course: 'Naturfag',
      answered: true,
    });
  });*/

  const mock = axios.create();

  it('TEST: postFeedback \n Should work', async () => {
    mocked(mock.post).mockResolvedValue({});
    await postFeedback(':id', 'feedback');

    const call = mocked(mock.post).mock.calls[0];

    expect(call[0]).toEqual('feedback/question/:id');
    expect(call[1]).toEqual({ feedbackText: 'feedback' });
  });

  const questionForm: IQuestion = {
    email: 'testetestesen@testesen.no',
    studentGrade: '8',
    subjectID: 1,
    questionText: 'questionText',
    isPublic: true,
    totalRows: 0,
    themes: [
      {
        theme: 'yes',
        id: 0,
      },
    ],
    files: [
      {
        share: 'questionfiles',
        directory: 'hei',
        fileName: 'Hei',
        fileUrl: 'hei',
      },
    ],
  };

  it('TEST: postQuestion \n Should work', async () => {
    mocked(mock.post).mockResolvedValue({});
    await postQuestion(questionForm);

    const call = mocked(mock.post).mock.calls[1];

    expect(call[0]).toEqual('questions');
    expect(call[1]).toEqual({
      email: 'testetestesen@testesen.no',
      studentGrade: '8',
      subjectID: 1,
      questionText: 'questionText',
      isPublic: true,
      totalRows: 0,
      files: [
        {
          share: 'questionfiles',
          directory: 'hei',
          fileName: 'Hei',
          fileUrl: 'hei',
        },
      ],
      themes: [
        {
          id: 0,
          theme: 'yes',
        },
      ],
    });
  });
});
