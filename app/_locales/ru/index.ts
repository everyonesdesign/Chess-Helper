import {
  TLocaleSet,
} from '../../src/types';

const translations : TLocaleSet = {
  inputHint: 'Введите ход или нажмите / для вызова команд...',
  focusHint: 'Нажмите C для ввода хода...',
  focusHintFromOther: 'Нажмите Esc + C для ввода хода...',
  ambiguousMove: '$move: найдено более 1 хода',
  incorrectMove: 'Некорректный ход: $move',
  illegalMove: 'Невозможно сделать ход $move',
  commandNotFound: 'Команда $command не найдена',
  blindFoldPeekHint: 'Наведите курсор сюда или нажмите $key чтобы увидеть доску',
  blindFoldOn: 'Режим игры вслепую включен',
  blindfoldToggleHint: 'Нажмите сюда или введите /blindfold для выключения',
  _test: 'Test content',
  _test_1_placeholder: 'Test content $name1',
  _test_2_placeholders: 'Test content $name1 $name2',
};

export default translations;
