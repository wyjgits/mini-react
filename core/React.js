
function createTextNode(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: []
    }
  }
}

function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child => {
        return typeof child === 'string' ? createTextNode(child) : child
      })
    },
  }
}

let root = null;
function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el]
    }
  }
  root = nextWorkOfUnit;
}

let nextWorkOfUnit = null;

function commitRoot() {
  console.log('commitRoot')
  if(root) {
    commitWork(root.child);
    root = null
  }
}

function commitWork(fiber) {
  if(!fiber) return;
  fiber.parent.dom.append(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);

    shouldYield = deadline.timeRemaining() < 1;
  }
  if(!nextWorkOfUnit && root) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function updateProps(dom, props) {
  Object.keys(props).forEach(key => {
    if (key !== 'children') {
      dom[key] = props[key]
    }
  })
}

function initChildren(fiber) {
  const children = fiber.props.children;

  let prevChild = null
  children.forEach((child, index) => {
    const newFiber = {
      type: child.type,
      dom: null,
      props: child.props,
      sibling: null,
      parent: fiber,
      child: null,
    }
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  })
}

function performWorkOfUnit(fiber) {
  if (!fiber.dom) {
    const dom = fiber.dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);
    // fiber.parent.dom.append(dom)
    updateProps(dom, fiber.props)
  }
  initChildren(fiber);

  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.sibling) {
    return fiber.sibling;
  }
  return fiber.parent?.sibling;
}

requestIdleCallback(workLoop)

export default {
  render,
  createTextNode,
  createElement
}