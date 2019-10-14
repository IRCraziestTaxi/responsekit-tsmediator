import { CommandResult } from "@responsekit/core";
import { BaseMediator } from "tsmediator";

// From "Overriding mediator behaviour" section of tsmediator readme:
export class CommandResultMediator extends BaseMediator {
    public Request<T>(query: string, payload: any): Promise<CommandResult<T>> {
        return this.Process(query, payload);
    }

    public Send<T>(command: string, payload: any): Promise<CommandResult<T>> {
        return this.Process(command, payload);
    }

    private Process<T>(msg: string, payload: any): Promise<CommandResult<T>> {
        const handler: any = super.Resolve(msg);

        if (handler.Validate) {
            try {
                handler.Validate(payload);
            }
            // Since Validate only handles validating the request payload,
            // we have our Validate methods throw a Rejection of type BadRequest.
            catch (rejection) {
                // Validate method threw a Rejection;
                // return it so the controller can handle it gracefully.
                return rejection;
            }
        }

        if (handler.Log) {
            handler.Log();
        }

        return handler.Handle(payload);
    }
}
