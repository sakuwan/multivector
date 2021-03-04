export default function extendProps([key, ...props], o = {}) {
  return (props.length === 0)
    ? key
    : Object.assign(o, { [key]: extendProps(props, o[key]) });
}
