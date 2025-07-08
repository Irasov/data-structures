//Начнем с реализации конструктора выделенного элемента множества:

class Item {
  constructor(value, keyCb) {
    // Значение
    this.value = value;
    // Кастомная функция извлечения ключа
    this.keyCb = keyCb;
    // Родительский узел
    this.parent = null;
    // Дочерние узлы
    this.children = {};
  }
  // Возвращает ключ (значение)
  getKey() {
    if (this.keyCb) {
      return this.keyCb(this.value);
    }
    return this.value;
  }

  // Возвращает корневой узел
  getRoot() {
    return this.isRoot() ? this : this.parent.getRoot();
  }

  // Определяет, является ли узел корневым
  isRoot() {
    return this.parent === null;
  }
  // Возвращает ранг (вес) узла
  getRank() {
    const children = this.getChildren();

    if (children.length === 0) {
      return 0;
    }

    let rank = 0;
    for (const child of children) {
      rank += 1;
      rank += child.getRank();
    }
    return rank;
  }

  // Возвращает потомков
  getChildren() {
    return Object.values(this.children);
  }
  // Устанавливает предка
  setParent(parent, forceSettingParentChild = true) {
    this.parent = parent;

    if (forceSettingParentChild) {
      parent.addChild(this);
    }

    return this;
  }

  // Добавляет потомка
  addChild(child) {
    this.children[child.getKey()] = child;
    child.setParent(this, false);

    return this;
  }
}

//риступаем к реализации СНМ:
class DisjointSet {
  constructor(cb) {
    // Кастомная функция извлечения ключа (значения) узла
    this.cb = cb;
    // Непересекающиеся подмножества
    this.items = {};
  }
  // Создает подмножество
  makeSet(value) {
    // Создаем выделенный элемент
    const item = new Item(value, this.cb);

    // Добавляем подмножество в список
    if (!this.items[item.getKey()]) {
      this.items[item.getKey()] = item;
    }

    return this;
  }
  // Ищет выделенный элемент
  find(value) {
    const temp = new Item(value, this.cb);
    const item = this.items[temp.getKey()];
    return item ? item.getRoot().getKey() : null;
  }
  // Объединяет подмножества
  union(value1, value2) {
    const root1 = this.find(value1);
    const root2 = this.find(value2);

    if (!root1 || !root2) {
      throw new Error('Одно или оба значения отсутствуют!');
    }

    if (root1 === root2) {
      return this;
    }

    const item1 = this.items[root1];
    const item2 = this.items[root2];

    // Определяем, какое подмножество имеет больший ранг.
    // Подмножество с меньшим рангом становится потомком подмножества с большим рангом
    if (item1.getRank() < item2.getRank()) {
      item2.addChild(item1);
      return this;
    }

    item1.addChild(item2);
    return this;
  }
  // Определяет, принадлежат ли значения к одному множеству
  isSameSet(value1, value2) {
    const root1 = this.find(value1);
    const root2 = this.find(value2);

    if (!root1 || !root2) {
      throw new Error('Одно или оба значения отсутствуют!');
    }

    return root1 === root2;
  }
}

//Автономную СНМ (без дополнительных зависимостей) можно реализовать следующим образом:
class DisjointSetAdHoc {
  constructor(size) {
    this.roots = new Array(size).fill(0).map((_, i) => i);
    this.heights = new Array(size).fill(1);
  }

  find(a) {
    if (this.roots[a] === a) return a;
    this.roots[a] = this.find(this.roots[a]);
    return this.roots[a];
  }

  union(a, b) {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA === rootB) return;

    if (this.heights[rootA] < this.heights[rootB]) {
      this.roots[rootA] = rootB;
    } else if (this.heights[rootA] > this.heights[rootB]) {
      this.roots[rootB] = rootA;
    } else {
      this.roots[rootB] = rootA;
      this.heights[rootA]++;
    }
  }

  connected(a, b) {
    return this.find(a) === this.find(b);
  }
}

//TEST
//Проверяем, что код выделенного элемента работает, как ожидается
const itemA = new Item('A');
const itemB = new Item('B');
const itemC = new Item('C');
const itemD = new Item('D');
console.log(itemA.getRank());
console.log(itemA.isRoot());

//Проверяем, что код СНМ работает, как ожидается:
const disjointSet = new DisjointSet();
disjointSet.makeSet('A');
console.log(disjointSet.find('A'));
console.log(disjointSet.find('B'));

//Проверяем, что код автономного СНМ работает, как ожидается:
const set = new DisjointSetAdHoc(10);

// 1-2-5-6-7 3-8-9 4
set.union(1, 2);
set.union(2, 5);
set.union(5, 6);
set.union(6, 7);

set.union(3, 8);
set.union(8, 9);
console.log(set.connected(1, 5));
console.log(set.connected(5, 7));
console.log(set.connected(4, 9));
