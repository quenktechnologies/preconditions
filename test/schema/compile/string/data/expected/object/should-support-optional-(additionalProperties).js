base.and(base.type("object"),base.or(object.restrict({id : base.type("number")}),object.map(base.optional(base.type("string")))))