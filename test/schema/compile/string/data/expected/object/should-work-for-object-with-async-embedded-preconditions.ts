base.and(object.schemaProperties({name : base.and(asyncStringify,asyncUppercase),id : base.identity}, object.restrict, base.and(asyncNumberify,asyncInc(1))),base.and(asyncObjectify,asyncDedupe))