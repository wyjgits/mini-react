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
      children: children.filter(Boolean).map(child => {
        const isText = ['string', 'number'].includes(typeof child);
        return isText ? createTextNode(child) : child;
      })
    }
  }
}
let root = null;
export function render (app, container) {
  nextWorkUnit = {
    dom: container,
    props: {
      children: [app]
    }
  }
  root = nextWorkUnit;
}

function updateFunctionComponent(fiber) {
  fiber.props.children = [fiber.type(fiber.props)]
}

function updateHostComponent(fiber) {
  if(!fiber.dom) {
    fiber.dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);
  }
  const props = fiber.props;
  Object.keys(props).forEach(key=> {
    if(key !== 'children') {
      fiber.dom[key] = props[key];
    }
  })
}

let nextWorkUnit = null;
function performNextWorkUnit(fiber) {
  const isFunctionComponent = typeof fiber.type === 'function';

  if(isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  const props = fiber.props;

  let nextFiber = null;
  props.children.forEach((child, index) => {
    console.log(fiber, child)
    const newFiber = {
      type: child.type,
      dom: null,
      props: child.props,
      child: null,
      parent: fiber,
      sibling: null
    }

    if(index === 0) {
      fiber.child = newFiber;
    } else {
      nextFiber.sibling = newFiber;
    }
    nextFiber = newFiber;
  })

  if(fiber.child) {
    return fiber.child;
  }
  if(fiber.sibling) {
    return fiber.sibling
  }
  let parent = fiber.parent;
  while(parent && !parent.sibling) {
    parent = parent.parent;
  }
  return parent?.sibling;
}

function commitRoot() {
  commitWork(root.child);
  root = null;
}

function commitWork(fiber) {
  if(!fiber) return;
  let parentFiber = fiber.parent;
  while(!parentFiber.dom) {
    parentFiber = parentFiber.parent;
  }
  fiber.dom && parentFiber.dom.append(fiber.dom);
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function workLoop(deadline) {
  while(deadline.timeRemaining() > 1 && nextWorkUnit) {
    nextWorkUnit = performNextWorkUnit(nextWorkUnit);
  }
  if(!nextWorkUnit && root) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
export default {
  render,
  createElement,
  createTextNode
}