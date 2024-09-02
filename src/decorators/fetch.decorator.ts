import { Op } from "sequelize";
import db from "../utils/db";

interface FetchOptions {
  options(): Map<string, any>;
}

abstract class FetchDecorator implements FetchOptions {
  protected fetchOptions: FetchOptions;

  constructor(fetchOptions: FetchOptions) {
    this.fetchOptions = fetchOptions;
  }

  options(): Map<string, any> {
    return new Map();
  }
}

export class AttributesDecorator extends FetchDecorator {
  private attributes: string;

  constructor(fetchOptions: FetchOptions, attributes: string) {
    super(fetchOptions);
    if (this.attributes) {
      this.attributes = attributes;
    }
  }

  options(): Map<string, any> {
    const d = this.fetchOptions.options();

    if (this.attributes) {
      d["attributes"] = this.attributes.replace(/\s+/g, "").split(",");
    } else {
      d["attributes"] = { exclude: ["hashedPassword"] };
    }

    return d;
  }
}

export class SearchDecorator extends FetchDecorator {
  private searchString: string;
  constructor(fetchOptions: FetchOptions, searchString?: string) {
    super(fetchOptions);
    if (this.searchString) {
      this.searchString = searchString;
    }
  }

  options(): Map<string, any> {
    const fO = this.fetchOptions.options();

    if (this.searchString) {
      const orSplit = this.searchString.split("|");

      const properties = {};
      if (orSplit.length > 1) {
        const orItems = [];
        for (const orV of orSplit) {
          const andSplitProperties = {};
          const andSplit = orV.split("&");
          if (andSplit.length > 1) {
            const d = {};
            for (const andV of andSplit) {
              const [key, value] = andV.split(":");
              d[key] = value;
            }
            orItems.push(d);
          } else {
            const [key, value] = orV.split(":");
            andSplitProperties[key] = value;
            orItems.push(andSplitProperties);
          }
        }
        properties["where"] = {
          [Op.or]: orItems,
        };
      } else {
        const andSplit = this.searchString.split("&");
        properties["where"] = {};
        const andItems = [];
        if (andSplit.length > 1) {
          const d = new Map();
          for (const andV of andSplit) {
            const [key, value] = andV.split(":");
            properties["where"][key] = value;
          }
        } else {
          const [key, value] = andSplit[0].split(":");
          properties["where"][key] = value;
        }
      }

      fO["where"] = properties["where"];
    }

    return fO;
  }
}

export class SortDecorator extends FetchDecorator {
  private sortString: string;
  constructor(fetchOptions: FetchOptions, sortString: string) {
    super(fetchOptions);
    this.sortString = sortString;
  }

  options(): Map<string, any> {
    const fO = this.fetchOptions.options();

    if (this.sortString) {
      const order = [];
      const [key, value] = this.sortString.split(":");
      order.push(key);
      order.push(value);
      const d = [];
      d.push(order);

      fO["order"] = d;
    }

    return fO;
  }
}

export class JoinDecorator extends FetchDecorator {
  private joinString: string;
  constructor(fetchOptions: FetchOptions, joinString: string) {
    super(fetchOptions);
    this.joinString = joinString;
  }

  options(): Map<string, any> {
    const fO = this.fetchOptions.options();

    if (this.joinString) {
      const items = this.joinString
        .replace(/\s+/g, "")
        .split(",")
        .map((el) => {
          const model = {
            model: db[el],
          };
          if (el === "Authentication") {
            model["attributes"] = {
              exclude: ["hashedPassword"],
            };
          }
          return model;
        });

      fO["include"] = items;
    }

    return fO;
  }
}

export class RawDecorator extends FetchDecorator {
  private raw: boolean;
  constructor(fetchOptions: FetchOptions, raw: boolean) {
    super(fetchOptions);
    this.raw = raw;
  }

  options(): Map<string, any> {
    const fO = this.fetchOptions.options();
    fO["raw"] = this.raw;
    return fO;
  }
}

export class OffsetDecorator extends FetchDecorator {
  private offset: number;
  constructor(fetchOptions: FetchOptions, offset: number) {
    super(fetchOptions);
    this.offset = offset;
  }

  options(): Map<string, any> {
    const fO = this.fetchOptions.options();
    fO["offset"] = this.offset;
    return fO;
  }
}

export class LimitDecorator extends FetchDecorator {
  private limit: number;
  constructor(fetchOptions: FetchOptions, limit: number) {
    super(fetchOptions);
    this.limit = limit;
  }

  options(): Map<string, any> {
    const fO = this.fetchOptions.options();
    fO["limit"] = this.limit;
    return fO;
  }
}

class SimpleFetchOptions implements FetchOptions {
    options(): Map<string, any>{
        return new Map()
    }
}

type OptionsInterface = {
    attributes?: string;
    search?: string;
    sort?: string;
    join?: string;
    raw?: boolean;
    offset?: number;
    limit?: number;
}

export function optionsBuilder(query: OptionsInterface){
    let optionsMap = new SimpleFetchOptions()

    if(query.attributes){
        optionsMap = new AttributesDecorator(optionsMap, query.attributes)
    }
    if(query.search){
        optionsMap = new SearchDecorator(optionsMap, query.search)
    }
    if(query.sort){
        optionsMap = new SortDecorator(optionsMap, query.sort)
    }
    if(query.join){
        optionsMap = new JoinDecorator(optionsMap, query.join)
    }
    if(query.raw){
        optionsMap = new RawDecorator(optionsMap, query.raw)
    }
    if(query.offset){
        optionsMap = new OffsetDecorator(optionsMap, query.offset)
    }
    const limit = query.offset ? query.offset : 200
    optionsMap = new LimitDecorator(optionsMap, limit)

    return Object.fromEntries(optionsMap.options())
}