
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
        const isText = typeof child === 'string' || typeof child === 'number'
        return isText ? createTextNode(child) : child
      })
    },
  }
}

function createDom(type) {
  return type === 'TEXT_ELEMENT'
    ? document.createTextNode('')
    : document.createElement(type)
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
  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }
  fiber.dom && fiberParent.dom.append(fiber.dom);
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

function initChildren(fiber, children) {
  console.log(fiber, children)
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

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];
  initChildren(fiber, children);
}

function updateHostFunction(fiber) {
  if (!fiber.dom) {
    const dom = fiber.dom = createDom(fiber.type);
    updateProps(dom, fiber.props)
  }
  initChildren(fiber, fiber.props.children);
}

function performWorkOfUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === 'function';

  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostFunction(fiber);
  }

  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.sibling) {
    return fiber.sibling;
  }
  let fiberParent = fiber.parent;
  while (fiberParent && !fiberParent.sibling) {
    fiberParent = fiberParent.parent
  }
  return fiberParent?.sibling;
}

requestIdleCallback(workLoop)

export default {
  render,
  createTextNode,
  createElement
}