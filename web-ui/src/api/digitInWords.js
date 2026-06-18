const hundreds = [
  'сто', 'двести', 'триста',
  'четыреста', 'пятьсот', 'шестьсот',
  'семьсот', 'восемьсот', 'девятьсот'
];

const more = ['миллион', 'миллиард', 'триллион', 'квадриллион',
              'квинтиллион', 'секстиллион', 'септиллион'];

const teens = [
  'одиннадцать', 'двенадцать', 'тринадцать',
  'четырнадцать', 'пятнадцать', 'шестнадцать',
  'семнадцать', 'восемнадцать', 'девятнадцать'
];

const tens = [
  'десять', 'двадцать', 'тридцать',
  'сорок', 'пятьдесят', 'шестьдесят',
  'семьдесят', 'восемьдесят', 'девяносто'
];

const ten = [
  'три',
  'четыре', 'пять', 'шесть',
  'семь', 'восемь', 'девять'
];

const oneTwo = [
  ['один', 'два'],
  ['одна', 'две']
];


// Принимает срез исходного числа (str) и "падеж" и выводит это число прописью
function base(numStr, numPos) {
  const num = numStr.split('').map(Number);
  while (num.length < 3) num.unshift(0);

  const res = [];
  if (num[0] !== 0) {
    res.push(hundreds[num[0] - 1]);
  }
  num.shift();

  if (num[0] !== 0) {
    if (num[0] === 1 && num[1] > 0 && num[1] < 10) {
      // от 11 до 19
      res.push(teens[num[1] - 1]);
      num.shift();
      num.push(0); // Нужно, чтобы не было пятьсот пятнадцать пять
    } else {
      res.push(tens[num[0] - 1]);
    }
  }
  num.shift();

  if (num[0] !== 0) {
    if (num[0] <= 2) {
      res.push(oneTwo[numPos][num[0] - 1]);
    } else {
      res.push(ten[num[0] - 3]);
    }
  }

  return res.join(' ');
}


// Разбивает число на тройки
function splitByThrees(value) {
  let s = String(value);
  const groups = [];
  while (s.length > 0) {
    groups.unshift(s.slice(-3));
    s = s.slice(0, -3);
  }
  return groups;
}


// Принимает исходное число, разбивает его на тройки с помощью split_by_threes,
// определяет разряд, суёт в base, добавляет разряд и склеивает
export function digitInWords(amount) {
  const negative = amount < 0;
  const abs = Math.abs(amount).toFixed(2);
  const [rub, cop] = abs.split('.');
  // rub = "141'212'341"
  // cop = 31

  const inputInThrees = splitByThrees(rub).reverse();
  // СТРОКА!

  const a = [];
  let counter = -1;

  for (const i of inputInThrees) {
    // 1 миллион, 2 миллиона, 5 миллионов
    // разряды, к которым можно добавить "а", "ов" или ничего и всё ок


    // но есть ещё 1 тысяча, 2 тысячи, 5 тысяч
    // а тут добавить "а", "и", или ничего! и всё!

    // определить при каких условиях что добавлять и сделать (может быть в функцию отправлять окончание какое добавлять и само )
    // инвертировать список, if i == 1/2/3/4 дописивать в конец строки
    counter++;

    if (counter === 0) {
      // рубль: 1
      // рубля: 2, 3, 4
      // рублей: всё остальное
      if (parseInt(i, 10) === 0) {
        if (parseInt(rub, 10) > 0) {
          a.push('рублей');
        } else {
          a.push('ноль рублей');
        }
        continue;
      }

      const lastDigit = parseInt(i, 10) % 10;
      const lastTwo = parseInt(i, 10) % 100;
      let word;

      if (lastTwo >= 11 && lastTwo <= 19) {
        word = ' рублей';
      } else if (lastDigit === 1) {
        word = ' рубль';
      } else if (lastDigit >= 2 && lastDigit <= 4) {
        word = ' рубля';
      } else {
        word = ' рублей';
      }

      a.push(base(i, 0) + word);

    } else if (counter === 1) {
      if (parseInt(i, 10) === 0) continue;

      const lastTwo = parseInt(i, 10) % 100;
      const lastDigit = parseInt(i, 10) % 10;
      let word;

      if (lastTwo >= 11 && lastTwo <= 19) {
        word = ' тысяч';
      } else if (lastDigit === 1) {
        word = ' тысяча';
      } else if (lastDigit >= 2 && lastDigit <= 4) {
        word = ' тысячи';
      } else {
        word = ' тысяч';
      }

      a.unshift(base(i, 1) + word);

    } else {
      // миллион: 1
      // миллиона: 2, 3, 4,
      // миллионов: всё остальное
      // и так со всеми more
      if (parseInt(i, 10) === 0) continue;

      const lastDigit = parseInt(i, 10) % 10;
      const lastTwo = parseInt(i, 10) % 100;
      let word;

      if (lastTwo >= 11 && lastTwo <= 19) {
        word = ` ${more[counter - 2]}ов`;
      } else if (lastDigit === 1) {
        word = ` ${more[counter - 2]}`;
      } else if (lastDigit >= 2 && lastDigit <= 4) {
        word = ` ${more[counter - 2]}а`;
      } else {
        word = ` ${more[counter - 2]}ов`;
      }

      a.unshift(base(i, 0) + word);
    }
  }

  // теперь копейки.
  // копейка: 1
  // копейки: 2, 3, 4
  // копеек: остальное

  const copLastTwo = parseInt(cop, 10) % 100;
  const copLastDigit = parseInt(cop, 10) % 10;
  let copWord;

  if (copLastTwo >= 11 && copLastTwo <= 19) {
    copWord = ' копеек';
  } else if (copLastDigit === 1) {
    copWord = ' копейка';
  } else if (copLastDigit >= 2 && copLastDigit <= 4) {
    copWord = ' копейки';
  } else {
    copWord = ' копеек';
  }

  a.push(cop + copWord);

  const result = a.join(' ');
  return negative ? 'минус ' + result : result;
}
