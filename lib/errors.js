class DomainError extends Error {
    constructor(message) {
      super(message)

      this.name = this.constructor.name
      
      Error.captureStackTrace(this, this.constructor)
    }
  }
  
class ResourceNotFoundError extends DomainError {
    constructor(resource, query) {
        super(`Resource ${resource} was not found.`)
        this.data = { resource, query }
    }
}

class InternalError extends DomainError {
    constructor(error) {
        super(error.message)
        this.data = { error }
    }
}

class GasTooLowError extends DomainError {
    constructor(message, minimumGasRequired) {
        super(message)
        this.data = { minimumGasRequired }
    }
}

module.exports = {
    DomainError,
    ResourceNotFoundError,
    InternalError,
    GasTooLowError
}