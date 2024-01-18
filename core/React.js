
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

let wipRoot = null;
let currentRoot = null;
function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el]
    }
  }
  wipRoot = nextWorkOfUnit;
}

let wipFiber = null;
function update() {
  const currentFiber = wipFiber;
  return () => {
    wipRoot = {
      ...currentFiber,
      alternate: currentFiber
    }
    nextWorkOfUnit = wipRoot;
  }
}

let nextWorkOfUnit = null;

function commitRoot() {
  deletions.forEach(commitDeletion);
  deletions = []
  if (wipRoot) {
    commitWork(wipRoot.child);
    currentRoot = wipRoot;
    wipRoot = null;
  }
}

function commitDeletion(fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent;
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent;
    }
    fiberParent.dom.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child);
  }

}

function commitWork(fiber) {
  if(!fiber) return;
  let fiberParent = fiber.parent
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent
  }
  if (fiber.dom) {
    if (fiber.effectTag === 'update') {
    } else if (fiber.effectTag = 'placement') {
      fiberParent.dom.append(fiber.dom);
    }
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props || {})
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);
    if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
      console.log('hit', wipRoot, nextWorkOfUnit);
      nextWorkOfUnit = null;
    }

    shouldYield = deadline.timeRemaining() < 1;
  }
  if (!nextWorkOfUnit && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function updateProps(dom, props, prevProps) {
  Object.keys(prevProps).forEach(key => {
    if (key !== 'children' && !(key in props)) {
      dom.removeAttribute(key);
    }
  })
  Object.keys(props).forEach(key => {
    if (key !== 'children') {
      if (props[key] !== prevProps[key]) {
        if (key.startsWith('on')) {
          const eventName = key.slice(2).toLocaleLowerCase();
          dom.removeEventListener(eventName, prevProps[key])
          dom.addEventListener(eventName, props[key])
        } else {
          dom[key] = props[key]
        }
      }
    }
  })
}

let deletions = [];

function initChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child;
  let prevChild = null
  children.forEach((child, index) => {
    const isSameType = oldFiber && oldFiber.type === child.type;
    let newFiber = null;
    if (isSameType) {
      newFiber = {
        type: child.type,
        dom: oldFiber.dom,
        props: child.props || { children: [] },
        sibling: null,
        parent: fiber,
        child: null,
        alternate: oldFiber,
        effectTag: 'update'
      }
    } else {
      if (child) {
        newFiber = {
          type: child.type,
          dom: null,
          props: child.props || { children: [] },
          sibling: null,
          parent: fiber,
          child: null,
          effectTag: 'placement'
        }
      }
      oldFiber && deletions.push(oldFiber);
    }
    if (index === 0) {
      fiber.child = newFiber;
    } else {
      prevChild.sibling = newFiber;
    }
    newFiber && (prevChild = newFiber);
    oldFiber = oldFiber?.sibling;
  })
  while (oldFiber) {
    deletions.push(oldFiber);
    oldFiber = oldFiber.sibling;
  }
}

function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  const children = [fiber.type(fiber.props)];
  initChildren(fiber, children);
}

function updateHostFunction(fiber) {
  if (!fiber.dom) {
    const dom = fiber.dom = createDom(fiber.type);
    // updateProps(dom, fiber.props, {})
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
  update,
  createTextNode,
  createElement
}