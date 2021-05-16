export { };

declare global {
	export interface Array<T> {
		gap<K> (this: T[], e: K): Array<T | K>;
	}
}
