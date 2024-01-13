
function createTextNode(text) {
  console.log('use createTextNode')
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text
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

function render(el,container) {

  const dom = el.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(el.type)
  const props = el.props;
    Object.keys(props).forEach(key => {
      if(key !== 'children') {
        dom[key] = props[key];
      }
    })
    const children = el.props.children;
  
    children?.forEach(child => {
      render(child, dom);
    })


  container.append(dom);
}

export default {
  render,
  createTextNode,
  createElement
}