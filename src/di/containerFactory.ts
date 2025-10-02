import { Container } from "./Container";

export class ContainerFactory {
    private static instance:Container | null = null;

    public static getContainer(): Container {
        if (this.instance === null) {
            this.instance = new Container();
        }
        return this.instance;
    }
}