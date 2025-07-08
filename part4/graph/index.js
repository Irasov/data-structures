// Вспомогательная функция сравнения узлов
class Comparator {
  constructor(fn) {
    this.compare = fn || Comparator.defaultCompare;
  }
  // Дефолтная функция сравненя узлов
  static defaultCompare(a, b) {
    if (a === b) {
      return 0;
    }
    return a < b ? -1 : 1;
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
    return this.lessThan(a, b) || this.equal(a, b);
  }
  //Больше или равно
  greaterThanOrEqual(a, b) {
    return this.greaterThan(a, b) || this.equal(a, b);
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
    this.head = new Node(value, this.head);
    // Если хвостовой узел отсутствует, значит,
    if (!this.tail) {
      // головной узел также является хвостовым
      this.tail = this.head;
    }
    // Это обеспечивает возможность вызова методов по цепочке
    return this;
  }

  // Добавляет значение в конец списка
  append(value) {
    // Создаем новый узел
    const node = new Node(value);
    // Если головной узел отсутствует, то
    if (!this.head) {
      // добавляем значение в начало списка
      return this.prepend(value);
    }
    // Добавляем ссылку на новый узел в хвостовой
    this.tail.next = node;
    // Обновляем хвостовой узел
    // (новый узел становится хвостовым (последним))
    this.tail = node;

    return this;
  }

  // Добавляет значение в список по указанному индексу
  insert(value, index) {
    // Если индекс равен 0, то
    if (index === 0) {
      // Добавляем значение в начало списка
      return this.prepend(value);
    }
    // Создаем новый узел
    const node = new Node(value);
    // Текущий узел (начинаем с головного)
    let current = this.head;
    // Счетчик
    let i = 1;
    // Пока есть текущий узел
    while (current) {
      // Прерываем цикл при совпадении счетчика с индексом -
      // это означает, что мы нашли нужный узел
      if (i === index) {
        break;
      }
      // Переходим к следующему узлу
      current = current.next;
      // Увеличиваем значение счетчика
      i += 1;
    }
    // Если узел найден
    if (current) {
      // Добавляем ссылку на следующий узел в новый
      node.next = current.next;
      // Обновляем ссылку текущего узла на следующий
      // (новый узел помещается между текущим и следующим: current и current.next)
      current.next = node;
    } else {
      // Если узел не найден,
      // добавляем значение в конец списка
      return this.append(value);
    }
    return this;
  }

  // Удаляет головной узел
  removeHead() {
    // Если головной узел отсутствует, значит,
    if (!this.head) {
      // список пуст - удалять нечего
      return null;
    }

    // Удаляемый узел - головной
    const removed = this.head;

    // Если головной узел содержит ссылку на следующий
    if (this.head.next) {
      // Обновляем головной узел (заменяем на следующий)
      this.head = this.head.next;
    } else {
      // Иначе, обнуляем головной и хвостовой узлы,
      // (делаем список пустым, поскольку он содержал только один узел)
      this.head = null;
      this.tail = null;
    }

    // Возвращаем удаленный узел
    return removed;
  }

  // Удаляет хвостовой узел
  removeTail() {
    // Если головной узел отсутствует, значит,
    if (!this.head) {
      // список пуст - удалять нечего
      return null;
    }

    // Удаляемый узел - хвостовой
    let removed = this.tail;
    // Крайний случай: если список состоит из одного узла,
    if (this.head === this.tail) {
      // обнуляем головной и хвостовой узлы
      // (делаем список пустым)
      this.head = null;
      this.tail = null;
      // Возвращаем удаленный узел
      return removed;
    }
    // Текущий узел (начинаем с головного)
    let current = this.head;
    // Обнуляем ссылку на следующий узел.
    // Пока есть следующий узел
    while (current.next) {
      // Если следующий узел является последним
      // (не содержит ссылки на следующий),
      if (!current.next.next) {
        // обнуляем ссылку текущего узла на следующий
        current.next = null;
      } else {
        // Иначе, переходим к следующему узлу
        current = current.next;
      }
    }

    // Обновляем хвостовой узел (заменяем на текущий)
    this.tail = current;

    // Возвращаем удаленный узел
    return removed;
  }

  // Удаляет узел по значению
  remove(value) {
    // Если головной узел отсутствует, значит,
    if (!this.head) {
      // список пуст - удалять нечего
      return null;
    }

    // Последний удаленный узел
    let removed = null;

    // Пока есть и удаляется головной узел
    while (this.head && this.compare.equal(this.head.value, value)) {
      // Обновляем удаляемый узел
      removed = this.head;
      // Обновляем головной узел (заменяем на следующий)
      this.head = this.head.next;
    }
    // Текущий узел (начинаем с головного)
    let current = this.head;
    // Если узел имеется
    if (current) {
      // Пока есть следующий узел
      while (current.next) {
        // Если значения совпадают
        if (this.compare.equal(current.next.value, value)) {
          // Обновляем удаляемый узел
          removed = current.next;
          // Обновляем ссылку текущего узла (заменяем на следующий,
          // чтобы закрыть образовавшуюся брешь)
          current.next = current.next.next;
        } else {
          // Иначе, переходим к следующему узлу
          current = current.next;
        }
      }
    }

    // Крайний случай: если удаляется хвостовой узел,
    if (this.compare.equal(this.tail.value, value)) {
      // обновляем его (заменяем на текущий)
      this.tail = current;
    }

    // Возвращаем удаленный узел
    return removed;
  }

  // Ищет узел по значению.
  // Принимает искомое значение и функцию поиска
  // в виде объекта
  find({ value, cb }) {
    // Если головной узел отсутствует, значит,
    console.log(value);
    if (!this.head) {
      // список пуст - искать нечего
      return null;
    }

    // Текущий узел (начинаем с головного)
    let current = this.head;

    // Пока есть текущий узел
    while (current) {
      // Если передана функция, и она удовлетворяется,
      if (cb && cb(current.value)) {
        // возвращаем текущий узел
        return current;
      }

      // Если передано значение, и значения совпадают,
      if (value && this.compare.equal(current.value, value)) {
        // возвращаем текущий узел
        return current;
      }

      // Переходим к следующему узлу
      current = current.next;
    }

    // Ничего не найдено
    return null;
  }

  // Инвертирует список
  reverse() {
    // Текущий узел (начинаем с головного)
    let current = this.head;
    // Предыдущий узел
    let prev = null;
    // Следующий узел
    let next = null;

    // Пока есть текущий узел
    while (current) {
      // Обновляем переменную для следующего узла
      next = current.next;
      // Обновляем ссылку текущего узла на предыдущий
      current.next = prev;
      // Обновляем переменную для предыдущего узла
      prev = current;
      // Переходим к следующему узлу
      current = next;
    }

    // Меняем местами головной и хвостовой узлы
    this.tail = this.head;
    // Обновляем головной узел
    // (заменяем последним предыдущим - хвостовым)
    this.head = prev;

    return this;
  }

  // Создает список из массива
  fromArray(arr) {
    // Перебираем элементы массива и добавляем каждый в конец списка
    arr.forEach((value) => this.append(value));

    return this;
  }

  // Преобразует список в массив
  toArray() {
    // Массив узлов
    const arr = [];
    // Текущий узел (начинаем с головного)
    let current = this.head;
    // Пока есть текущий узел
    while (current) {
      // Добавляем узел в массив
      arr.push(current);
      // Переходим к следующему узлу
      current = current.next;
    }
    // Возвращаем массив
    return arr;
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
    );
  }
}

// Функция сравнения ребер
const edgeComparator = (a, b) => {
  if (a.getKey() === b.getKey()) {
    return 0;
  }

  return a.getKey() < b.getKey() ? -1 : 1;
};

class NodeGraph {
  constructor(value) {
    if (!value) {
      throw new Error('Узел графа должен иметь значение!');
    }

    // Значение узла
    this.value = value;
    // Связный список ребер
    this.edges = new LinkedList(edgeComparator);
  }
  // Добавляет ребро в список
  addEdge(edge) {
    this.edges.append(edge);

    return this;
  }

  // Удаляет ребро из списка
  removeEdge(edge) {
    this.edges.remove(edge);

    return this;
  }

  // Удаляет все ребра
  removeAllEdges() {
    this.getEdges().forEach((edge) => {
      this.removeEdge(edge);
    });

    return this;
  }
  // Возвращает список соседних узлов
  getNeighbors() {
    const edges = this.edges.toArray();

    return edges.map((node) => (node.value.from === this ? node.value.to : node.value.from));
  }

  // Возвращает список ребер в виде массива значений
  getEdges() {
    return this.edges.toArray().map((node) => node.value);
  }

  // Возвращает длину (глубину) узла
  getDegree() {
    return this.edges.toArray().length;
  }

  // Возвращает значение узла
  getKey() {
    return this.value;
  }
  // Определяет наличие ребра
  hasEdge(edge) {
    const _edge = this.edges.find({ cb: (node) => node === edge });

    return Boolean(_edge);
  }

  // Определяет наличие соседа
  hasNeighbor(node) {
    const _node = this.edges.find({
      cb: (n) => n.to === node || n.from === node,
    });

    return Boolean(_node);
  }
  // Выполняет поиск ребра по узлу
  findEdge(node) {
    const _node = this.edges.find({
      cb: (n) => n.to === node || n.from === node,
    });

    return _node ? _node.value : null;
  }
  // Возвращает строковое представление узла.
  // Принимает кастомную функцию стрингификации
  toString(cb) {
    return cb ? cb(this.value) : `${this.value}`;
  }
}

//Код ребра графа до неприличия прост, поэтому привожу его целиком:
class Edge {
  constructor(from, to, weight = 0) {
    // Начальный узел
    this.from = from;
    // Конечный узел
    this.to = to;
    // Вес ребра
    this.weight = weight;
  }

  // Возвращает ключ ребра
  getKey() {
    const fromKey = this.from.getKey();
    const toKey = this.to.getKey();

    // Например, `A_B`
    return `${fromKey}_${toKey}`;
  }

  // Инвертирует ребро
  reverse() {
    const tmp = this.from;
    this.from = this.to;
    this.to = tmp;

    return this;
  }

  // Преобразует ребро в строку
  toString() {
    return this.getKey();
  }
}

//TEST

const nodeA = new NodeGraph('A');
const nodeB = new NodeGraph('B');
const nodeC = new NodeGraph('C');

const edgeAB = new Edge(nodeA, nodeB);
const edgeAC = new Edge(nodeA, nodeC);
nodeA.addEdge(edgeAB).addEdge(edgeAC);
console.log(nodeA.hasEdge(edgeAB));
console.log(nodeB.hasEdge(edgeAB));
console.log(nodeA.getEdges()[0].toString());
console.log(nodeA.getEdges()[1].toString());

//Проверяем, что код ребра работает, как ожидается:

const from = new NodeGraph('A');
const to = new NodeGraph('B');
const edge = new Edge(from, to);
console.log(edge.getKey());
console.log(edge.toString());

//Приступаем к реализации графа:

class Graph {
  constructor(isDirected = false) {
    // Индикатор направленности графа
    // (по умолчанию граф является ненаправленным)
    this.isDirected = isDirected;
    // Узлы
    this.nodes = {};
    // Ребра
    this.edges = {};
  }
  // Добавляет узел в граф
  addNode(newNode) {
    this.nodes[newNode.getKey()] = newNode;

    return this;
  }

  // Возвращает узел по ключу
  getNodeByKey(key) {
    return this.nodes[key];
  }

  // Возвращает соседние узлы
  getNeighbors(node) {
    return node.getNeighbors();
  }

  // Возвращает значения всех узлов
  getAllNodes() {
    return Object.values(this.nodes);
  }

  // Возвращает значения всех ребер
  getAllEdges() {
    return Object.values(this.edges);
  }
  // Добавляет ребро в граф
  addEdge(newEdge) {
    // Пытаемся найти начальную и конечную вершины
    let from = this.getNodeByKey(newEdge.from.getKey());
    let to = this.getNodeByKey(newEdge.to.getKey());

    // Добавляем начальную вершину
    if (!from) {
      this.addNode(newEdge.from);
      from = this.getNodeByKey(newEdge.from.getKey());
    }

    // Добавляем конечную вершину
    if (!to) {
      this.addNode(newEdge.to);
      to = this.getNodeByKey(newEdge.to.getKey());
    }

    // Если ребро уже добавлено
    if (this.edges[newEdge.getKey()]) {
      throw new Error('Ребро уже добавлено!');
    } else {
      // Добавляем ребро
      this.edges[newEdge.getKey()] = newEdge;
    }

    // Добавляем ребро в вершины
    if (this.isDirected) {
      from.addEdge(newEdge);
    } else {
      from.addEdge(newEdge);
      to.addEdge(newEdge);
    }

    return this;
  }

  // Удаляет ребро из графа
  removeEdge(edge) {
    if (this.edges[edge.getKey()]) {
      // Удаляем ребро
      delete this.edges[edge.getKey()];
    } else {
      throw new Error('Ребро не найдено!');
    }

    // Пытаемся найти начальную и конечную вершины
    let from = this.getNodeByKey(edge.from.getKey());
    let to = this.getNodeByKey(edge.to.getKey());

    // Удаляем ребро из вершин
    from && from.removeEdge(edge);
    to && to.removeEdge(edge);
  }

  // Находит ребро в графе
  findEdge(from, to) {
    // Находим узел по начальному ключу
    const node = this.getNodeByKey(from.getKey());

    if (!node) return null;

    // Пытаемся найти конечное ребро
    return node.findEdge(to);
  }
  // Возвращает вес графа
  getWeight() {
    // Суммируем веса всех ребер
    return this.getAllEdges().reduce((acc, edge) => acc + edge.weight, 0);
  }

  // Инвертирует граф
  reverse() {
    // Для каждого ребра
    this.getAllEdges().forEach((edge) => {
      // Удаляем ребро из графа
      this.removeEdge(edge);

      // Инвертируем ребро
      edge.reverse();

      // Снова добавляем ребро в граф
      this.addEdge(edge);
    });

    return this;
  }

  // Возвращает индексы узлов в виде объекта
  getNodesIndices() {
    const indices = {};

    this.getAllNodes().forEach((node, index) => {
      indices[node.getKey()] = index;
    });

    return indices;
  }
  // Возвращает матрицу смежности
  getAdjacencyMatrix() {
    // Узлы
    const nodes = this.getAllNodes();
    // Индексы узлов
    const indices = this.getNodesIndices();
    // Инициализируем матрицу смежности (заполняем ее `null`)
    const matrix = new Array(nodes.length).fill().map(() => new Array(nodes.length).fill(null));

    // Формируем матрицу.
    // Перебираем узлы
    nodes.forEach((node, index) => {
      // Перебираем соседей узла
      node.getNeighbors().forEach((neighbor) => {
        // Индекс соседа
        const neighborIndex = indices[neighbor.getKey()];
        // [индекс узла][индекс соседа] = вес ребра
        matrix[index][neighborIndex] = this.findEdge(node, neighbor).weight;
      });
    });

    return matrix;
  }
  // Возвращает строковое представление графа
  toString() {
    return Object.keys(this.nodes).toString();
  }
}

//TEST
const graph = new Graph();

const nodeAA = new NodeGraph('A');
const nodeBB = new NodeGraph('B');

graph.addNode(nodeAA).addNode(nodeBB);
console.log(graph.toString());
