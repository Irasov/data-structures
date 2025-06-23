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

// Узел двусвязного списка
class Node {
    constructor(value, next = null, prev = null) {
      // Значение
      this.value = value
      // Ссылка на следующий узел
      this.next = next
      // Ссылка на предыдущий узел
      this.prev = prev
    }
  
    // Возвращает строковое представление узла.
    // Принимает кастомную функцию стрингификации
    toString(cb) {
      return cb ? cb(this.value) : `${this.value}`
    }
}

// Двусвязный список
class DoublyLinkedList {
    constructor(fn) {
        // Головной (первый) узел
        this.head = null
        // Хвостовой (последний) узел
        this.tail = null
        // Функция сравнения узлов
        this.compare = new Comparator(fn)
    }

    // Добавляет значение в начало списка
    prepend(value) {
        // Создаем новый узел
        const node = new Node(value, this.head)
        // Если головной узел имеется,
        if (this.head) {
          // обновляем его ссылку на предыдущий узел
          this.head.prev = node
        }
        // Обновляем головной узел (заменяем на новый)
        this.head = node
        // Если хвостовой узел отсутствует, значит,
        if (!this.tail) {
          // головной узел также является хвостовым
          // (список был пустым)
          this.tail = node
        }
        // Это обеспечивает возможность вызова методов по цепочке
        return this
    }

      // Добавляет значение в конец списка
    append(value) {
        // Если головной узел отсутствует,
        if (!this.head) {
          // добавляем значение в начало списка
          return this.prepend(value)
        }
        // Создаем новый узел
        const node = new Node(value)
        // Добавляем ссылку на следующий (новый) узел в хвостовой
        this.tail.next = node
        // Добавляем ссылку на предыдущий (хвостовой) узел в новый
        node.prev = this.tail
        // Обновляем хвостовой узел
        this.tail = node
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
            // Обнуляем ссылку головного узла на предыдущий
            this.head.prev = null
        } else {
            // Иначе, обнуляем головной и хвостовой узлы
            // (делаем список пустым, поскольку он содержал только один узел)
            this.head = null
            this.tail = null
        }
        // Возвращаем удаленный узел
        return removed
    }
  
    // Удаляет хвостовой узел
    removeTail() {
        // Если хвостовой узел отсутствует, значит,
        if (!this.tail) {
            // список пуст -удалять нечего
            return null
        }
        // Удаляемый узел - хвостовой
        const removed = this.tail
        // Крайний случай: если список состоит из одного узла
        if (this.head === this.tail) {
            // Обнуляем головной и хвостовой узлы
            // (делаем список пустым)
            this.head = null
            this.tail = null
            // Возвращаем удаленный узел
            return removed
        }
        // Обновляем хвостовой узел (заменяем на предыдущий)
        this.tail = this.tail.prev
        // Обнуляем ссылку хвостового узла на следующий
        this.tail.next = null
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
        // Удаляемый узел
        let removed = null
        // Текущий узел (начинаем с головного)
        let current = this.head
    
        // Пока есть текущий узел
        while (current) {
        // Если значения совпадают
            if (this.compare.equal(current.value, value)) {
                // Обновляем удаляемый узел
                removed = current
                // Если удаляется головной узел,
                if (removed === this.head) {
                    // обновляем головной узел
                    this.head = removed.next
                    // Если новый головной узел имеется,
                    if (this.head) {
                        // обнуляем его ссылку на предыдущий узел
                        this.head.prev = null
                    }
                    // Если также удаляется хвостовой узел
                    // (список содержит только один узел),
                    if (removed === this.tail) {
                        // обнуляем хвостовой узел
                        // (делаем список пустым)
                        this.tail = null
                    }
                // Иначе, если удаляется хвостовой узел,
                } else if (removed === this.tail) {
                    // обновляем хвостовой узел
                    this.tail = removed.prev
                    // Обнуляем ссылку хвостового узла на следующий
                    this.tail.next = null
                } else {
                    // Предыдущий узел
                    const prev = removed.prev
                    // Следующий узел
                    const next = removed.next
                    // Обновляем ссылку предыдущего узла на следующий
                    prev.next = next
                    // Обновляем ссылку следующего узла на предыдущий
                    // (закрываем образовавшуюся брешь)
                    next.prev = prev
                }
            }
            // Переходим к следующему узлу
            current = current.next
        }
        // Возвращаем удаленный узел
        return removed
    }

    // Ищет узел по значению.
    // Принимает искомое значение и функцию поиска
    // в виде объекта
    find({ value, cb }) {
        // Если головной узел отсутствует, значит,
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
            // Обновляем переменную для предыдущего узла
            prev = current.prev
            // Обновляем ссылки текущего узла
            current.next = prev
            current.prev = next
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
            // Перебираем узлы и преобразуем каждый в строку
            .map((node) => node.toString(cb))
            // Преобразуем массив в строку
            .toString()
        )
    }
}


//Test
const list = new DoublyLinkedList();
list.append('1 Node');
list.append('2 Node');
list.append('3 Node');
list.append('4 Node');
console.log("append 4 nodes: " + list.toString());
list.prepend('0 Node');
console.log("prepend node: " + list.toString());
list.removeHead();
console.log("remove head: " + list.toString());
list.removeTail();
console.log("remove tail: " + list.toString());
list.remove("2 Node");
console.log("remove on value: " + list.toString());