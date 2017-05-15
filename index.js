function LocalDispatch(componentInstance, reducer){
  this.componentInstance = componentInstance
  this.reducer = reducer
  return (action, mapper) => {
    this.action = action
    this.mapper = mapper
    if(typeof action === 'function'){
      return action(this.dispatcher())
    }
    return this.dispatchWithReducer(action)
  }
}

LocalDispatch.prototype.dispatchWithReducer = function(actionData){
  this.newState = this.reducer(this.componentInstance.state, actionData)
  if(this.hasNoMapper()){
    return this.componentInstance.setState(this.newState)
  }
  if(this.isSingleMapper()){
    return this.componentInstance.setState(this.newState[this.mapper])
  }
  return this.setStateByMultipleMapper()
}

LocalDispatch.prototype.dispatcher = function(){
  return (actionData) => this.dispatchWithReducer(actionData)
}

LocalDispatch.prototype.setStateByMultipleMapper = function(){
  let newStateMapped = {}
  const mapper = Object.assign({}, this.mapper)
  if(mapper.$main !== undefined){
    const newStateMain = this.newState[mapper.$main]
    newStateMapped = Object.assign({}, newStateMain)
    delete(mapper.$main)
  }
  Object.keys(mapper).forEach((key) =>{
    const mapTo = mapper[key]
    newStateMapped[key] = this.newState[mapTo]
  })
  return this.componentInstance.setState(newStateMapped)
}

LocalDispatch.prototype.hasNoMapper = function(){
  return this.mapper === undefined
}

LocalDispatch.prototype.isSingleMapper = function(){
  return typeof(this.mapper) === 'string'
}

module.exports = LocalDispatch