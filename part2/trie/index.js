//Для реализации Хэш-таблица мы воспользуемся связным списком
// (мы будем использовать метод цепочек для разрешения коллизий)

// Вспомогательная функция сравнения узлов
class Comparator {
    constructor(fn) {
        this.compare = fn || Comparator.defaultCompare;
    }
    // Дефолтная функция сравненя узлов
    static defaultCompare(a, b) {
        if(a === b) {
            return 0;
        }
        return a < b ? - 1 : 1;
    }
    //Проверка на равенство 
    equal(a, b) { 
        return this.compare(a, b) === 0; 
    }
    //Меньше чем
    lessThan(a, b) {
        return this.compare(a, b) < 0;
    }
    //Больше чем
    greaterThan(a, b) {
        return this.compare(a, b) > 0;
    }
    //Меньше или равно
    lessThanOrEqual(a, b) {
        return this.lessThan(a, b) || this.equal(a, b)
    }
    //Больше или равно
    greaterThanOrEqual(a, b) {
        return this.greaterThan(a, b) || this.equal(a, b)
    }
    //Инверсия сравнения
    reverce() {
        const original = this.compare;
        this.compare = (a, b) => original(b, a);
    }
}

//Реализуем узел списка
class Node {
    constructor(value, next = null) {
        this.value = value;
        this.next = next;
    }
  // Возвращает строковое представление узла.
  // Принимает кастомную функцию стрингификации
    toString(cb) {
        return cb ? cb(this.value) : `${this.value}`;
    }
}

//Реализация связного списка
class LinkedList {
    constructor(fn) {
        // Головной (первый) узел
        this.head = null;
        // Хвостовой (последний) узел
        this.tail = null;
        // Функция сравнения узлов
        this.compare = new Comparator(fn);
    }

    // Добавляет значение в начало списка
    prepend(value) {
        // Создаем новый головной узел со ссылкой на предыдущий головной узел
        // (новый узел становится головным (первым))
        this.head = new Node(value, this.head)
        // Если хвостовой узел отсутствует, значит,
        if (!this.tail) {
        // головной узел также является хвостовым
            this.tail = this.head
        }
        // Это обеспечивает возможность вызова методов по цепочке
        return this
    }

    // Добавляет значение в конец списка
    append(value) {
        // Создаем новый узел
        const node = new Node(value)
        // Если головной узел отсутствует, то
        if (!this.head) {
          // добавляем значение в начало списка
          return this.prepend(value)
        }
        // Добавляем ссылку на новый узел в хвостовой
        this.tail.next = node
        // Обновляем хвостовой узел
        // (новый узел становится хвостовым (последним))
        this.tail = node
      
        return this
    }

    // Добавляет значение в список по указанному индексу
    insert(value, index) {
        // Если индекс равен 0, то
        if (index === 0) {
        // Добавляем значение в начало списка
        return this.prepend(value)
        }
        // Создаем новый узел
        const node = new Node(value)
        // Текущий узел (начинаем с головного)
        let current = this.head
        // Счетчик
        let i = 1
        // Пока есть текущий узел
        while (current) {
        // Прерываем цикл при совпадении счетчика с индексом -
        // это означает, что мы нашли нужный узел
        if (i === index) {
            break
        }
        // Переходим к следующему узлу
        current = current.next
        // Увеличиваем значение счетчика
        i += 1
        }
        // Если узел найден
        if (current) {
        // Добавляем ссылку на следующий узел в новый
        node.next = current.next
        // Обновляем ссылку текущего узла на следующий
        // (новый узел помещается между текущим и следующим: current и current.next)
        current.next = node
        } else {
        // Если узел не найден,
        // добавляем значение в конец списка
        return this.append(value)
        }
        return this
    }

    // Удаляет головной узел
    removeHead() {
        // Если головной узел отсутствует, значит,
        if (!this.head) {
        // список пуст - удалять нечего
        return null
        }
    
        // Удаляемый узел - головной
        const removed = this.head
    
        // Если головной узел содержит ссылку на следующий
        if (this.head.next) {
        // Обновляем головной узел (заменяем на следующий)
        this.head = this.head.next
        } else {
        // Иначе, обнуляем головной и хвостовой узлы,
        // (делаем список пустым, поскольку он содержал только один узел)
        this.head = null
        this.tail = null
        }
    
        // Возвращаем удаленный узел
        return removed
    }
  
  // Удаляет хвостовой узел
    removeTail() {
        // Если головной узел отсутствует, значит,
        if (!this.head) {
        // список пуст - удалять нечего
        return null
        }
  
        // Удаляемый узел - хвостовой
        let removed = this.tail
        // Крайний случай: если список состоит из одного узла,
        if (this.head === this.tail) {
            // обнуляем головной и хвостовой узлы
            // (делаем список пустым)
            this.head = null
            this.tail = null
            // Возвращаем удаленный узел
            return removed
        }
        // Текущий узел (начинаем с головного)
        let current = this.head
        // Обнуляем ссылку на следующий узел.
        // Пока есть следующий узел
        while (current.next) {
            // Если следующий узел является последним
            // (не содержит ссылки на следующий),
            if (!current.next.next) {
                // обнуляем ссылку текущего узла на следующий
                current.next = null
            } else {
                // Иначе, переходим к следующему узлу
                current = current.next
            }
        }
    
        // Обновляем хвостовой узел (заменяем на текущий)
        this.tail = current
    
        // Возвращаем удаленный узел
        return removed
    }

    // Удаляет узел по значению
    remove(value) {
        // Если головной узел отсутствует, значит,
        if (!this.head) {
            // список пуст - удалять нечего
            return null
        }
    
        // Последний удаленный узел
        let removed = null
    
        // Пока есть и удаляется головной узел
        while (this.head && this.compare.equal(this.head.value, value)) {
            // Обновляем удаляемый узел
            removed = this.head
            // Обновляем головной узел (заменяем на следующий)
            this.head = this.head.next
        }
        // Текущий узел (начинаем с головного)
        let current = this.head
        // Если узел имеется
        if (current) {
            // Пока есть следующий узел
            while (current.next) {
                // Если значения совпадают
                if (this.compare.equal(current.next.value, value)) {
                    // Обновляем удаляемый узел
                    removed = current.next
                    // Обновляем ссылку текущего узла (заменяем на следующий,
                    // чтобы закрыть образовавшуюся брешь)
                    current.next = current.next.next
                } else {
                    // Иначе, переходим к следующему узлу
                    current = current.next
                }
            }
        }
    
        // Крайний случай: если удаляется хвостовой узел,
        if (this.compare.equal(this.tail.value, value)) {
            // обновляем его (заменяем на текущий)
            this.tail = current
        }
    
        // Возвращаем удаленный узел
        return removed
    }
    
    // Ищет узел по значению.
    // Принимает искомое значение и функцию поиска
    // в виде объекта
    find({ value, cb }) {
        // Если головной узел отсутствует, значит,
        console.log(value);
        if (!this.head) {
            // список пуст - искать нечего
            return null
        }
  
        // Текущий узел (начинаем с головного)
        let current = this.head
  
        // Пока есть текущий узел
        while (current) {
            // Если передана функция, и она удовлетворяется,
            if (cb && cb(current.value)) {
                // возвращаем текущий узел
                return current
            }
  
             // Если передано значение, и значения совпадают,
            if (value && this.compare.equal(current.value, value)) {
                // возвращаем текущий узел
                return current
            }
  
            // Переходим к следующему узлу
            current = current.next
        }
  
        // Ничего не найдено
        return null
    }

    // Инвертирует список
    reverse() {
        // Текущий узел (начинаем с головного)
        let current = this.head
        // Предыдущий узел
        let prev = null
        // Следующий узел
        let next = null
    
        // Пока есть текущий узел
        while (current) {
            // Обновляем переменную для следующего узла
            next = current.next
            // Обновляем ссылку текущего узла на предыдущий
            current.next = prev
            // Обновляем переменную для предыдущего узла
            prev = current
            // Переходим к следующему узлу
            current = next
        }
    
        // Меняем местами головной и хвостовой узлы
        this.tail = this.head
        // Обновляем головной узел
        // (заменяем последним предыдущим - хвостовым)
        this.head = prev
    
        return this
    }

    // Создает список из массива
    fromArray(arr) {
        // Перебираем элементы массива и добавляем каждый в конец списка
        arr.forEach((value) => this.append(value))
  
        return this
    }
    
    // Преобразует список в массив
    toArray() {
        // Массив узлов
        const arr = []
        // Текущий узел (начинаем с головного)
        let current = this.head
        // Пока есть текущий узел
        while (current) {
            // Добавляем узел в массив
            arr.push(current)
            // Переходим к следующему узлу
            current = current.next
        }
        // Возвращаем массив
        return arr
    }

    // Возвращает строковое представление списка.
    // Принимает кастомную функцию стрингификации
    toString(cb) {
        // Преобразуем список в массив
        return (
        this.toArray()
            // Перебираем узлы списка и преобразуем каждый в строку
            .map((node) => node.toString(cb))
            // Преобразуем массив в строку
            .toString()
        )
    }

}

// Дефолтный размер таблицы
// (в реальности размер будет намного больше)
const defaultHashTableSize = 32;

// Хэш-таблица
class HashTable {
    constructor(size = defaultHashTableSize) {
        // Создаем таблицу указанного размера и
        // заполняем ее пустыми связными списками
        this.buckets = new Array(size).fill(null).map(() => new LinkedList())
        // Хранилище ключей
        this.keys = {}
    }
    // Преобразует ключ в хэшированное значение
    // (хэш-функция)
    hash(key) {
        // Для простоты в качестве хэша используется сумма кодов символов ключа
        // https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
        const hash = [...key].reduce((acc, char) => acc + char.charCodeAt(0), 0)
        // Хэш (индекс) не должен превышать размера таблицы
        return hash % this.buckets.length
    }
    // Устанавливает значение по ключу
    set(key, value) {
        // Хэшируем ключ
        // (получаем индекс массива)
        const index = this.hash(key)
        // Сохраняем хэш по ключу
        this.keys[key] = index
        // Извлекаем нужный список
        const bucket = this.buckets[index]
        // Извлекаем узел
        // (значением узла является объект)
        const node = bucket.find({ cb: (value) => value.key === key })
        // Если узел не найден
        if (!node) {
            // Добавляем новый узел
            bucket.append({ key, value })
        } else {
            // Иначе, обновляем значение узла
            node.value.value = value
        }
    }
    // Удаляет значение по ключу
    remove(key) {
        // Хэшируем ключ
        const index = this.hash(key)
        // Удаляем хэш по ключу
        delete this.keys[key]
        // Извлекаем нужный список
        const bucket = this.buckets[index]
        // Извлекаем узел
        const node = bucket.find({ cb: (value) => value.key === key })
        // Возвращаем удаленный узел или `null`,
        // если узел отсутствует
        return node ? bucket.remove(node.value) : null
    }
    // Возвращает значение по ключу
    get(key) {
        // Хэшируем ключ
        const index = this.hash(key)
        // Извлекаем нужный список
        const bucket = this.buckets[index]
        // Извлекаем узел
        const node = bucket.find({ cb: (value) => value.key === key })
        // Возвращаем значение узла или `null`,
        // если узел отсутствует
        return node ? node.value.value : null
    }
    // Определяет наличие ключа
    has(key) {
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn
        return Object.hasOwn(this.keys, key)
    }
    // Возвращает все ключи
    getKeys() {
        return Object.keys(this.keys)
    }
    // Возвращает все значения
    getValues() {
        // Перебираем списки и возвращаем значения всех узлов
        return this.buckets.reduce((acc, bucket) => {
        return acc.concat(
            // Метод `toArray` преобразует связный список в массив
            bucket.toArray().map((node) => node.value.value),
        )
        }, [])
    }
}


// Последний (завершающий) символ
const HEAD_CHARACTER = '*'

// Узел префиксного дерева
class TrieNode {
  constructor(char, isCompleteWord = false) {
    // Символ
    this.char = char
    // Индикатор завершающего символа
    this.isCompleteWord = isCompleteWord
    // Хэш-таблица потомков
    this.children = new HashTable()
  }

  // Добавляет потомка в дерево
  addChild(char, isCompleteWord = false) {
    // Добавляем узел при отсутствии
    if (!this.hasChild(char)) {
      this.children.set(char, new  TrieNode(char, isCompleteWord))
    }

    // Извлекаем узел
    const node = this.getChild(char)

    // Обновляем флаг `isCompleteWord` при необходимости,
    // например, при добавлении слова "car" после слова "carpet",
    // букву "r" нужно пометить как завершающую
    node.isCompleteWord = node.isCompleteWord || isCompleteWord

    // Возвращаем узел
    return node
  }

  // Удаляет потомка
  removeChild(char) {
    // Извлекаем узел
    const node = this.getChild(char)

    // Удаляем узел, только если:
    // - у него нет потомков
    // - node.isCompleteWord === false
    if (node && !node.isCompleteWord && !node.hasChildren()) {
      this.children.remove(char)
    }

    return this
  }

  // Возвращает потомка
  getChild(char) {
    return this.children.get(char)
  }

  // Определяет наличие потомка
  hasChild(char) {
    return this.children.has(char)
  }

  // Определяет наличие потомков
  hasChildren() {
    return this.children.getKeys().length > 0
  }

  // Автодополнение (предложение следующих символов)
  suggestChildren() {
    return [...this.children.getKeys()]
  }

  // Преобразует потомков в строку
  // с указанием признака завершающего символа
  toString() {
    let childrenAsString = this.suggestChildren().toString()
    childrenAsString = childrenAsString ? `:${childrenAsString}` : ''
    const isCompleteString = this.isCompleteWord ? HEAD_CHARACTER : ''

    return `${this.char}${isCompleteString}${childrenAsString}`
  }
}

// Префиксное дерево
class Trie {
    constructor() {
      // Головной (корневой) узел
      this.head = new TrieNode(HEAD_CHARACTER)
    }
  
    // Добавляет слово (ключ) в дерево
    addWord(word) {
      // Преобразуем строку (слово) в массив символов
      // (вопрос на засыпку: почему лучше не использовать `split()`?
      // Подсказка: попробуйте преобразовать "Hello, 👋!")
      const chars = [...word]
  
      // Текущий узел (начинаем с головного)
      let node = this.head
  
      // Перебираем символы и добавляем каждый в дерево
      for (let i = 0; i < chars.length; i++) {
        // Индикатор последнего (завершающего) символа
        const isComplete = i === chars.length - 1
        // Добавляем потомка
        node = node.addChild(chars[i], isComplete)
      }
  
      return this
    }
  
    // Удаляет слово (ключ) из дерева
    removeWord(word) {
      // Удаляет слово рекурсивно ("сначала в глубину")
      const depthFirstRemove = (node, i = 0) => {
        // Если удаляемый символ находится за пределами слова,
        // ничего не делаем
        if (i >= word.length) return
  
        // Символ
        const char = word[i]
        // Следующий узел
        const nextNode = node.getChild(char)
  
        // Если следующий узел отсутствует,
        // ничего не делаем
        if (!nextNode) return
  
        // Погружаемся глубже
        depthFirstRemove(nextNode, i + 1)
  
        // Поскольку мы удаляем слово,
        // необходимо обновить флаг `isCompleteWord`
        // его последнего символа
        if (i === word.length - 1) {
          nextNode.isCompleteWord = false
        }
  
        // Узел удаляется, только если:
        // - у него нет потомков
        // - nextNode.isCompleteWord === false
        node.removeChild(char)
      }
  
      // Начинаем с головного узла
      depthFirstRemove(this.head)
  
      return this
    }
  
    // Автодополнение (предложение следующих символов)
    suggestNextCharacters(word) {
      // Получаем последний символ
      const lastChar = this.getLastCharNode(word)
  
      // Если последний символ отсутствует
      if (!lastChar) {
        return null
      }
  
      // Возвращаем массив следующих символов
      return lastChar.suggestChildren()
    }
  
    // Определяет наличие слова в дереве
    doesWordExist(word) {
      // Получаем последний символ
      const lastChar = this.getLastCharNode(word)
  
      return Boolean(lastChar) && lastChar.isCompleteWord
    }
  
    // Возвращает последний символ
    getLastCharNode(word) {
      // Разбиваем слово на символы
      const chars = [...word]
      // Текущий узел (начинаем с головного)
      let node = this.head
  
      // Перебираем символы
      for (let i = 0; i < chars.length; i++) {
        // Если символ отсутствует
        if (!node.hasChild(chars[i])) {
          return null
        }
  
        // Извлекаем потомка
        node = node.getChild(chars[i])
      }
  
      // Возвращаем последний узел
      return node
    }
}

//test
const trieNode = new TrieNode('c', true);
console.log(trieNode.toString());
trieNode.addChild('a', true);
trieNode.addChild('o');
console.log(trieNode.toString());

const trie = new Trie();
trie.addWord('cat')
console.log(trie.head.toString());

