const update = (state, hook) => {
  state.hooks = {
    ...state.hooks,
    [hook.creator]: [
      ...(state.hooks[hook.creator] || []).filter(h => h.index !== hook.index),
      hook
    ].sort((a, b) => b.index - a.index)
  }
}

export default {
  UPDATE: (state, { hook }) => update(state, hook)
}
