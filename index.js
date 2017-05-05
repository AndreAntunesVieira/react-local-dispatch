export default class LocalDispatch{
  constructor(componentInstance, reducer){
    this.componentInstance = componentInstance
    this.reducer = reducer
    return (action, mapper) => {
      this.mapper = mapper
      if(typeof action === 'function'){
        return action(this.dispatcher())
      }
      return this.dispatchWithReducer(action)
    }
  }

  dispatchWithReducer(actionData){
    this.newState = this.reducer(this.componentInstance.state, actionData)
    if(this.hasNoMapper()){
      return this.componentInstance.setState(this.newState)
    }
    if(this.isSingleMapper()){
      return this.componentInstance.setState(this.newState[this.mapper])
    }
    return this.setStateByMultipleMapper()
  }

  dispatcher(){
    return (actionData) => this.dispatchWithReducer(actionData)
  }

  setStateByMultipleMapper(){
    let newStateMapped = {};
    const mapper = {...this.mapper}
    if(mapper.$main !== undefined){
      const newStateMain = this.newState[mapper.$main]
      newStateMapped = Object.assign({}, {...newStateMain})
      delete(mapper.$main)
    }
    Object.keys(mapper).forEach((key) =>{
      const mapTo = mapper[key]
      newStateMapped[key] = this.newState[mapTo]
    })
    return this.componentInstance.setState(newStateMapped)
  }

  hasNoMapper(){
    return this.mapper === undefined
  }

  isSingleMapper(){
    return typeof(this.mapper) === 'string'
  }
}
