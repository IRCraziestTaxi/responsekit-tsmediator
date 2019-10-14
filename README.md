# @responsekit/tsmediator

## Install
This lib relies on the [`@responsekit/core`](https://github.com/IRCraziestTaxi/responsekit) lib.

To use `@responsekit/tsmediator`:

```
npm install --save @responsekit/core @responsekit/tsmediator
```

## CommandResultMediator
Process your `tsmediator` commands with `@responsekit/tsmediator`'s `CommandResultMediator` to gracefully handle `Rejection`s thrown in the `Validate` method.

Your command handler would return `Rejection`s in the `Handle` method and throw `Rejection`s in the `Validate` method, like so:

```ts
import { CommandResult, GenericResponse, Rejection } from "@responsekit/core";
import { Handler, ICommandHandler } from "tsmediator";
import { Thing } from "../entities/Thing";
import { AddThingCommand } from "./AddThingCommand";

@Handler("AddThingHandler")
export class AddThingHandler implements ICommandHandler<
AddThingCommand,
Response<CommandResult<Thing>>
> {
    public async Handle(command: AddThingCommand): Promise<CommandResult<Thing>> {
        try {
            // Create the Thing.

            return new GenericResponse({
                value: createdThing
            });
        }
        catch (error) {
            return new Rejection(error);
        }
    }

    public Validate(command: AddThingCommand): void {
        if (!command) {
            return Rejection.BadRequest("Invalid request.");
        }
    }
}
```

Then, in your controller, etc.:

```ts
const result: CommandResult<Thing> = await new Mediator().Send("CommandHandler", command);

if (result instanceof Rejection) {
    // Return a response whose status is result.reason and whose payload contains result.message.
}

// Return a response with status 200 (or similar) whose payload is the GenericResponse that is the result.
```

For a base controller that handles returning the appropriate express `Response` for the resulting `CommandResult`, check out the [`@responsekit/express`](https://github.com/IRCraziestTaxi/responsekit-express) package.