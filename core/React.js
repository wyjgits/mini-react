
function createTextNode(text) {
  console.log('use createTextNode')
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

function render(el, container) {
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el]
    }
  }
  // const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type)
  // const props = el.props;
  // Object.keys(props).forEach(key => {
  //   if (key !== 'children') {
  //     dom[key] = props[key];
  //   }
  // })
  // const children = el.props.children;

  // children.forEach(child => {
  //   render(child, dom);
  // })


  // container.append(dom);
}

let nextWorkOfUnit = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performWorkOfUnit(nextWorkOfUnit);

    shouldYield = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}

function mountDom(fiber) {
  const dom = fiber.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(fiber.type);
  fiber.dom = dom;
  fiber.parent.dom.append(dom);
  return dom;
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
    const dom = mountDom(fiber);
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