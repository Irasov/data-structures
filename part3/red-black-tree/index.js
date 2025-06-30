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

//Начнем с реализации суперкласса узла двоичного дерева:
class BinaryTreeNode {
    constructor(value = null) {
      // Значение
      this.value = value
      // Левый потомок
      this.left = null
      // Правый потомок
      this.right = null
      // Предок
      this.parent = null
      // Дополнительная информация об узле
      this.meta = new HashTable()
      // Функция сравнения узлов
      this.nodeComparator = new Comparator()
    }
    // Геттер высоты (глубины) левого поддерева
    get leftHeight() {
        if (!this.left) {
            return 0
        }
        return this.left.height + 1
    }
    // Геттер высоты правого поддерева
    get rightHeight() {
        if (!this.right) {
            return 0
        }
        return this.right.height + 1
    }
    // Геттер максимальной высоты
    get height() {
        return Math.max(this.leftHeight, this.rightHeight)
    }
    // Геттер разницы между высотой левого и правого поддеревьев
    // (фактор балансировки, баланс-фактор)
    get balanceFactor() {
        return this.leftHeight - this.rightHeight
    }
    // Для определения правильного места для вставки элемента нам также потребуется геттер узла, соседнего с родительским (дяди):
    // Геттер дяди
    get uncle() {
        // Если нет предка, то нет и дяди
        if (!this.parent) {
            return null
        }
        // Если нет дедушки, то нет и дяди
        if (!this.parent.parent) {
            return null
        }
        // Если у дедушки нет двух потомков, то нет и дяди
        if (!this.parent.parent.left || !this.parent.parent.right) {
            return null
        }
        // Выясняем, кто является дядей
        // путем сравнения предка с потомком дедушки
        if (this.nodeComparator.equal(this.parent, this.parent.parent.left)) {
            // Дядя - правый узел
            return this.parent.parent.right
        }
        // Дядя - левый узел
         return this.parent.parent.left
    }
    //Методы установки значения, левого и правого потомков:
    // Устанавливает значение
    setValue(value) {
        this.value = value
        return this
    }
    // Устанавливает левого потомок
    setLeft(node) {
        // Сбрасываем предка левого узла
        if (this.left) {
            this.left.parent = null
        }
        // Обновляем левый узел
        this.left = node
        // Делаем текущий узел предком нового левого узла
        if (this.left) {
            this.left.parent = this
        }
        return this
    }
    // Устанавливает правого потомка
    setRight(node) {
        // Сбрасываем предка правого узла
        if (this.right) {
            this.right.parent = null
        }
        // Обновляем правый узел
        this.right = node
        // Делаем текущий узел предком нового правого узла
        if (this.right) {
            this.right.parent = this
        }
        return this
    }
    // Удаляет потомка
    removeChild(nodeToRemove) {
        // Если удаляется левый потомок
        if (this.left && this.nodeComparator.equal(this.left, nodeToRemove)) {
            this.left = null
            return true
        }
        // Если удаляется правый потомок
        if (this.right && this.nodeComparator.equal(this.right, nodeToRemove)) {
            this.right = null
            return true
        }
        return false
    }
    
    // Заменяет потомка
    replaceChild(nodeToReplace, replacementNode) {
        if (!nodeToReplace || !replacementNode) {
            return false
        }
        // Если заменяется левый потомок
        if (this.left && this.nodeComparator.equal(this.left, nodeToReplace)) {
            this.left = replacementNode
            return true
        }
        // Если заменяется правый потомок
        if (this.right && this.nodeComparator.equal(this.right, nodeToReplace)) {
            this.right = replacementNode
            return true
        }
        return false
    }
    // Обходит дерево в порядке возрастания ключей (inorder, infix traverse):
    // сначала обходится левое поддерево, затем корень, затем правое поддерево
    traverseInOrder() {
        let result = []
        if (this.left) {
            result = result.concat(this.left.traverseInOrder())
        }
        result.push(this.value)
        if (this.right) {
            result = result.concat(this.right.traverseInOrder())
        }
        return result
    }
    // Статический метод копирования узла
    static copyNode(sourceNode, targetNode) {
        targetNode.setValue(sourceNode.value)
        targetNode.setLeft(sourceNode.left)
        targetNode.setRight(sourceNode.right)
    }
    // Преобразует дерево в строку
    toString() {
        return this.traverseInOrder().toString()
    }
}

//Приступаем к реализации узла двоичного дерева поиска
class BinarySearchTreeNode extends BinaryTreeNode {
    constructor(value = null, fn) {
      super(value)
      this.compareFn = fn
      this.nodeValueComparator = new Comparator(fn)
    }
    // Добавляет значение (узел)
    insert(value) {
        // Если значение отсутствует
        if (this.nodeValueComparator.equal(this.value, null)) {
            this.value = value
            return this
        }
        // Если новое значение меньше текущего
        if (this.nodeValueComparator.lessThan(value, this.value)) {
            // Если имеется левый потомок,
            if (this.left) {
                // добавляем значение в него
                return this.left.insert(value)
            }
            // Создаем новый узел
            const newNode = new BinarySearchTreeNode(value, this.compareFn)
            // и делаем его левым потомком
            this.setLeft(newNode)
            return newNode
        }
        // Если новое значение больше текущего
        if (this.nodeValueComparator.greaterThan(value, this.value)) {
            // Если имеется правый потомок,
            if (this.right) {
                // добавляем значение в него
                return this.right.insert(value)
            }
            // Создаем новый узел
            const newNode = new BinarySearchTreeNode(value, this.compareFn)
            // и делаем его правым потомком
            this.setRight(newNode)
        
            return newNode
        }
        return this
    }
    // Удаляет узел по значению
    remove(value) {
        // Ищем удаляемый узел
        const nodeToRemove = this.find(value)
        if (!nodeToRemove) {
            return null
        }
        // Извлекаем предка
        const { parent } = nodeToRemove
        if (!nodeToRemove.left && !nodeToRemove.right) {
            // Узел является листовым, т.е. не имеет потомков
            if (parent) {
                // У узла есть предок. Просто удаляем указатель на этот узел у предка
                parent.removeChild(nodeToRemove)
            } else {
                // У узла нет предка. Обнуляем значение текущего узла
                nodeToRemove.setValue(null)
            }
        } else if (nodeToRemove.left && nodeToRemove.right) {
            // Узел имеет двух потомков.
            // Находим следующее большее значение (минимальное значение в правом поддереве)
            // и заменяем им значение текущего узла
            const nextBiggerNode = nodeToRemove.right.findMin()
            if (!this.nodeComparator.equal(nextBiggerNode, nodeToRemove.right)) {
                this.remove(nextBiggerNode.value)
                nodeToRemove.setValue(nextBiggerNode.value)
            } else {
                // В случае, когда следующее правое значение является следующим большим значением,
                // и этот узел не имеет левого потомка,
                // просто заменяем удаляемый узел правым
                nodeToRemove.setValue(nodeToRemove.right.value)
                nodeToRemove.setRight(nodeToRemove.right.right)
            }
        } else {
            // Узел имеет одного потомка.
            // Делаем этого потомка прямым потомком предка текущего узла
            const childNode = nodeToRemove.left || nodeToRemove.right
            if (parent) {
                parent.replaceChild(nodeToRemove, childNode)
            } else {
                BinaryTreeNode.copyNode(childNode, nodeToRemove)
            }
        }
        // Обнуляем предка удаленного узла
        nodeToRemove.parent = null
        return true
    }
    // Ищет узел по значению
    find(value) {
        // Проверяем корень
        if (this.nodeValueComparator.equal(this.value, value)) {
            return this
        }
        if (this.nodeValueComparator.lessThan(value, this.value) && this.left) {
            // Проверяем левое поддерево
            return this.left.find(value)
        }
        if (this.nodeValueComparator.greaterThan(value, this.value) && this.right) {
            // Проверяем правое поддерево
            return this.right.find(value)
        }
        return null
    }
    
    // Определяет наличие узла
    contains(value) {
        return Boolean(this.find(value))
    }
    // Ищет узел с минимальным значением (нижний левый)
    findMin() {
        if (!this.left) {
            return this
        }
        return this.left.findMin()
    }
}

//Приступаем к реализации двоичного дерева поиска:
class BinarySearchTree {
    constructor(compareFn) {
      // Корневой узел
      this.root = new BinarySearchTreeNode(null, compareFn)
      // Функция сравнения узлов
      this.nodeComparator = this.root.nodeComparator
    }
    // Добавляет значение (узел)
    insert(value) {
        return this.root.insert(value)
    }
    // Удаляет узел по значению
    remove(value) {
        return this.root.remove(value)
    }
    // Определяет наличие узла
    contains(value) {
        return this.root.contains(value)
    }
    // Возвращает строковое представление дерева
    toString() {
        return this.root.toString()
    }
}

// Цвета
const COLORS = {
    red: 'red',
    black: 'black',
}
  
// Название поля, в котором хранится цвет
const PROP = 'color'
  
// Красно-черное дерево расширяет двоичное дерево поиска
class RedBlackTree extends BinarySearchTree {
    // Вставляет значение (узел)
    insert(value) {
      // Обычная вставка
      const insertedNode = super.insert(value)
  
      // Если добавляется корень,
      // if (!this.root.left && !this.root.right) {
      if (this.nodeComparator.equal(this.root, insertedNode)) {
        // делаем его черным
        this.makeNodeBlack(insertedNode)
      } else {
        // Делаем новый узел красным
        this.makeNodeRed(insertedNode)
      }
  
      // Выполняем балансировку дерева
      this.balance(insertedNode)
  
      // Возвращаем добавленный узел
      return insertedNode
    }
  
    // Удаляет узел
    remove(value) {
      throw new Error(`Невозможно удалить ${value}. Метод удаления не реализован`)
    }
  
    // Выполняет балансировку дерева
    balance(node) {
      // В случае корневого узла балансировать нечего
      if (this.nodeComparator.equal(this.root, node)) return
  
      // В случае черного предка балансировать нечего
      if (this.isNodeBlack(node.parent)) return
  
      const grandParent = node.parent.parent
  
      // Если у узла есть красный дядя, то нужно выполнить перекрашивание
      if (node.uncle && this.isNodeRed(node.uncle)) {
        // Перекрашиваем предка и дядю в черный
        this.makeNodeBlack(node.parent)
        this.makeNodeBlack(node.uncle)
  
        if (!this.nodeComparator.equal(this.root, grandParent)) {
          // Перекрашиваем дедушку в красный, если он не является корнем
          this.makeNodeRed(grandParent)
        } else {
          // Если дедушка - черный корень, ничего не делаем,
          // поскольку корень уже имеет двух черных потоков,
          // которых мы только что перекрасили
          return
        }
  
        // Выполняем балансировку для перекрашенного дедушки
        this.balance(grandParent)
        // Если дядя узла черный или отсутствует, нужно выполнить повороты
      } else if (!node.uncle || this.isNodeBlack(node.uncle)) {
        if (grandParent) {
          // Дедушка, которого мы получим после вращений
          let newGrandParent
  
          if (this.nodeComparator.equal(node.parent, grandParent.left)) {
            // Левый поворот
            if (this.nodeComparator.equal(node, grandParent.left.left)) {
              // Левый-левый поворот
              newGrandParent = this.leftLeftRotation(grandParent)
            } else {
              // Левый-правый поворот
              newGrandParent = this.leftRightRotation(grandParent)
            }
          } else {
            // Правый поворот
            if (this.nodeComparator.equal(node, grandParent.right.right)) {
              // Правый-правый поворот
              newGrandParent = this.rightRightRotation(grandParent)
            } else {
              // Правый-левый поворот
              newGrandParent = this.rightLeftRotation(grandParent)
            }
          }
  
          // Если `newGrandParent` не имеет предка, делаем его корнем
          // и красим в черный
          if (newGrandParent && !newGrandParent.parent) {
            this.root = newGrandParent
            this.makeNodeBlack(this.root)
          }
  
          // Выполняем балансировку для нового дедушки
          this.balance(newGrandParent)
        }
      }
    }
  
    // Выполняет левый-левый поворот
    leftLeftRotation(grandParentNode) {
      // Сохраняем предка дедушки
      const grandGrandParent = grandParentNode.parent
  
      // Определяем тип дедушки (левый или правый)
      let grandParentNodeIsLeft
      if (grandGrandParent) {
        grandParentNodeIsLeft = this.nodeComparator.equal(
          grandGrandParent.left,
          grandParentNode,
        )
      }
  
      // Сохраняем левого потомка дедушки
      const parentNode = grandParentNode.left
  
      // Сохраняем правого потомка предка
      const parentRightNode = parentNode.right
  
      // Делаем дедушку правым потомком предка
      parentNode.setRight(grandParentNode)
  
      // Делаем правого потомка предка левым потомком дедушки
      grandParentNode.setLeft(parentRightNode)
  
      // Заменяем дедушку предком
      if (grandGrandParent) {
        if (grandParentNodeIsLeft) {
          grandGrandParent.setLeft(parentNode)
        } else {
          grandGrandParent.setRight(parentNode)
        }
      } else {
        // Делаем предка корнем
        parentNode.parent = null
      }
  
      // Перекрашиваем дедушку и предка
      this.swapNodeColors(parentNode, grandParentNode)
  
      // Возвращаем новый корень
      return parentNode
    }
  
    // Выполняет левый-правый поворот
    leftRightRotation(grandParentNode) {
      // Сохраняем левый и левый правый узлы
      const parentNode = grandParentNode.left
      const childNode = parentNode.right
  
      // Сохраняем левый узел потомка во избежание потери
      // левого поддерева. Позже он будет перемещен в
      // правое поддерево предка
      const childLeftNode = childNode.left
  
      // Делаем предка левым узлом потомка
      childNode.setLeft(parentNode)
  
      // Делаем левый узел потомка правым узлом предка
      parentNode.setRight(childLeftNode)
  
      // Помещаем левый правый узел на место левого
      grandParentNode.setLeft(childNode)
  
      // Выполняем левый-левый поворот
      return this.leftLeftRotation(grandParentNode)
    }
  
    // Выполняет правый-правый поворот
    rightRightRotation(grandParentNode) {
      // Сохраняем предка дедушки
      const grandGrandParent = grandParentNode.parent
  
      // Определяем тип дедушки (левый или правый)
      let grandParentNodeIsLeft
      if (grandGrandParent) {
        grandParentNodeIsLeft = this.nodeComparator.equal(
          grandGrandParent.left,
          grandParentNode,
        )
      }
  
      // Сохраняем правого потомка дедушки
      const parentNode = grandParentNode.right
  
      // Сохраняем левого потомка предка
      const parentLeftNode = parentNode.left
  
      // Делаем дедушку левым потомком предка
      parentNode.setLeft(grandParentNode)
  
      // Делаем левого потомка предка правым потомком дедушки
      grandParentNode.setRight(parentLeftNode)
  
      // Заменяем дедушку предком
      if (grandGrandParent) {
        if (grandParentNodeIsLeft) {
          grandGrandParent.setLeft(parentNode)
        } else {
          grandGrandParent.setRight(parentNode)
        }
      } else {
        // Делаем предка корнем
        parentNode.parent = null
      }
  
      // Перекрашиваем дедушку и предка
      this.swapNodeColors(parentNode, grandParentNode)
  
      // Возвращаем новый корень
      return parentNode
    }
  
    // Выполняет правый-левый поворот
    rightLeftRotation(grandParentNode) {
      // Сохраняем правый и правый левый узлы
      const parentNode = grandParentNode.right
      const childNode = parentNode.left
  
      // Сохраняем правый узел потомка во избежание потери
      // правого поддерева. Позже он будет перемещен в
      // левое поддерево предка
      const childRightNode = childNode.right
  
      // Делаем предка правым узлом потомка
      childNode.setRight(parentNode)
  
      // Делаем правый узел потомка левым узлом предка
      parentNode.setLeft(childRightNode)
  
      // Помещаем потомка на место предка
      grandParentNode.setRight(childNode)
  
      // Выполняем правый-правый поворот
      return this.rightRightRotation(grandParentNode)
    }
  
    // Делает узел красным
    makeNodeRed(node) {
      node.meta.set(PROP, COLORS.red)
  
      return node
    }
  
    // Делает узел черным
    makeNodeBlack(node) {
      node.meta.set(PROP, COLORS.black)
  
      return node
    }
  
    // Проверяет, является ли узел красным
    isNodeRed(node) {
      return node.meta.get(PROP) === COLORS.red
    }
  
    // Проверяет, является ли узел черным
    isNodeBlack(node) {
      return node.meta.get(PROP) === COLORS.black
    }
  
    // Проверяет, покрашен ли узел
    isNodeColored(node) {
      return this.isNodeBlack(node) || this.isNodeRed(node)
    }
  
    // Перекрашивает узлы
    swapNodeColors(node1, node2) {
      const node1Color = node1.meta.get(PROP)
      const node2Color = node2.meta.get(PROP)
  
      node1.meta.set(PROP, node2Color)
      node2.meta.set(PROP, node1Color)
    }
}

//TEST

const tree = new RedBlackTree()

const firstInsertedNode = tree.insert(10)
const secondInsertedNode = tree.insert(15)
const thirdInsertedNode = tree.insert(5)

console.log(tree.toString());