# я сначала писал на python, поэтому оставил

hundreds = [
    "сто", "двести", "триста",
    "четыреста", "пятьсот", "шестьсот",
    "семьсот", "восемьсот", "девятьсот"
]

more = ['миллион', 'миллиард', 'триллион', 'квадриллион', 
        'квинтиллион', 'секстиллион', 'септиллион']

teens = [
    "одиннадцать", "двенадцать", "тринадцать",
    "четырнадцать", "пятнадцать", "шестнадцать",
    "семнадцать", "восемнадцать", "девятнадцать"
]

tens = [
    "десять", "двадцать", "тридцать",
    "сорок", "пятьдесят", "шестьдесят",
    "семьдесят", "восемьдесят", "девяносто"
]

ten = [
    "три",
    "четыре", "пять", "шесть",
    "семь", "восемь", "девять"
]

one_two = [
    ("один", "два"),
    ("одна", "две")
]


def base(num, num_pos):
    # Принимает срез исходного числа (str) и "падеж" и выводит это число прописью
    
    num = list(num)

    num = [int(a) for a in num]
    for i in range(3 - len(num)):
        num.insert(0, 0)
    res = []
    if num[0] != 0:
        res.append(hundreds[num[0] - 1])
    num.pop(0)
    
    if num[0] != 0:
        if num[0] == 1 and 0 < num[1] < 10:
            # от 11 до 19
            res.append(teens[num[1] - 1])
            num.pop(0)
            num.append(0) # Нужно, чтобы не было пятьсот пятнадцать пять
        else:
            res.append(tens[num[0] - 1])
    num.pop(0)
    
    if num[0] != 0:
        if num[0] <= 2:
            res.append(one_two[num_pos][num[0] - 1])
        else:
            res.append(ten[num[0] - 3])
    
    return ' '.join(res)


def split_by_threes(value):
    # Разбивает число на тройки
    s = str(value)
    groups = []
    while s:
        groups.insert(0, s[-3:])
        s = s[:-3]
    return groups


def main(input_):
    # Принимает исходное число, разбивает его на тройки с помощью split_by_threes, 
    # определяет разряд, суёт в base, добавляет разряд и склеивает
    
    rub, cop = input_.split('.')[0], input_.split('.')[1]
    # rub = "141'212'341"
    # cop = 31
    
    input_in_threes = split_by_threes(rub)[::-1]
    # СТРОКА!

    a = []
    counter = -1

    for i in input_in_threes:
        # 1 миллион, 2 миллиона, 5 миллионов
        # разряды, к которым можно добавить "а", "ов" или ничего и всё ок
        
        
        # но есть ещё 1 тысяча, 2 тысячи, 5 тысяч
        # а тут добавить "а", "и", или ничего! и всё!

        # определить при каких условиях что добавлять и сделать (может быть в функцию отправлять окончание какое добавлять и само )
        # инвертировать список, if i == 1/2/3/4 дописивать в конец строки
        counter += 1

        if counter == 0:
            # рубль: 1
            # рубля: 2, 3, 4
            # рублей: всё остальное
            if int(i) == 0:
                if int(rub) > 0:
                    a.append("рублей")
                else:
                    a.append("ноль рублей")
                continue

            last_digit = int(i) % 10
            last_two = int(i) % 100

            if 11 <= last_two <= 19:
                word = ' рублей'
            elif last_digit == 1:
                word = ' рубль'
            elif 2 <= last_digit <= 4:
                word = ' рубля'
            else:
                word = ' рублей'

            a.append(base(i, 0) + word)
        
        elif counter == 1:
            if int(i) == 0:
                continue

            last_two = int(i) % 100
            last_digit = int(i) % 10
            
            if 11 <= last_two <= 19:
                word = " тысяч"
            elif last_digit == 1:
                word = " тысяча"
            elif 2 <= last_digit <= 4:
                word = " тысячи"
            else:
                word = " тысяч"
            
            a.insert(0, base(i, 1) + word)

        else:
            # миллион: 1
            # миллиона: 2, 3, 4, 
            # миллионов: всё остальное
            # и так со всеми more
            if int(i) == 0:
                continue

            last_digit = int(i) % 10
            last_two = int(i) % 100

            if 11 <= last_two <= 19:
                word = f' {more[counter - 2]}ов'
            elif last_digit == 1:
                word = f' {more[counter - 2]}'
            elif 2 <= last_digit <= 4:
                word = f' {more[counter - 2]}а'
            else:
                word = f' {more[counter - 2]}ов'

            a.insert(0, base(i, 0) + word)
        
    # теперь копейки.
    # копейка: 1
    # копейки: 2, 3, 4
    # копеек: остальное

    last_two = int(cop) % 100
    last_digit = int(cop) % 10
    
    if 11 <= last_two <= 19:
        word = ' копеек'
    elif last_digit == 1:
        word = ' копейка'
    elif 2 <= last_digit <= 4:
        word = ' копейки'
    else:
        word = ' копеек'
    
    a.append(cop + word)

    return ' '.join(a)
