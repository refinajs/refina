import { Component, toComponentFunc } from "../component";
import { ContextMemberFactory } from "../context";
import { Prelude } from "../prelude";
import { App } from "./app";
import { AppHookMap, appHookNames } from "./hooks";

export interface Plugin extends Partial<AppHookMap> {
  name?: string;
  components?: Record<string, new () => Component>;
  contextFuncs?: Record<string, ContextMemberFactory>;
  htmlElementAlias?: Record<string, string>;
  onInstall?(app: App): void;
}

type PluginItem =
  | Plugin
  | false
  | null
  | undefined
  | readonly PluginItem[]
  | Promise<Plugin | false | null | undefined | readonly PluginItem[]>;

export type PluginOption = PluginItem[];

async function normalizePlugins(input: PluginItem): Promise<Plugin[]> {
  const plugins = await Promise.all(
    Array.isArray(input) ? input.map(normalizePlugins) : [input],
  );
  return plugins.flat().filter(Boolean) as Plugin[];
}

export async function installPlugins(app: App, plugins: PluginOption) {
  const pluginList = [Prelude as Plugin, ...(await normalizePlugins(plugins))];
  for (const plugin of pluginList) {
    plugin.onInstall?.(app);

    if (plugin.components) {
      for (const [name, component] of Object.entries(plugin.components)) {
        if (import.meta.env.DEV && name.startsWith("$")) {
          throw new Error(
            `Component name "${name}" should not start with "$".`,
          );
        }
        app.contextFuncs[name] = toComponentFunc(component);
      }
    }

    if (plugin.contextFuncs) {
      for (const [name, contextFunc] of Object.entries(plugin.contextFuncs)) {
        if (import.meta.env.DEV && name.startsWith("$")) {
          throw new Error(
            `Context function name "${name}" should not start with "$".`,
          );
        }
        app.contextFuncs[name] = (ckey, ...args) =>
          contextFunc(ckey, app)(...args);
      }
    }

    if (plugin.htmlElementAlias) {
      Object.assign(app.htmlElementAlias, plugin.htmlElementAlias);
    }

    for (const hookName of appHookNames) {
      const hook = plugin[hookName];
      if (hook) {
        app.pushPermanentHook(hookName, hook);
      }
    }
  }
}

export interface Plugins {}

type ExtractFuncName<N> = N extends string
  ? N extends `$${string}`
    ? never
    : N
  : never;

type GetContextFuncs<T extends Plugin> = T extends any
  ? {
      [K in ExtractFuncName<
        keyof T["components"]
      >]: T["components"][K] extends new () => {
        $main: infer F;
      }
        ? F
        : never;
    } & {
      [K in ExtractFuncName<
        keyof T["contextFuncs"]
      >]: T["contextFuncs"][K] extends ContextMemberFactory<infer F>
        ? F
        : never;
    }
  : never;

type GetComponents<T extends Plugin> = T extends any
  ? {
      [K in ExtractFuncName<
        keyof T["components"]
      >]: T["components"][K] extends new () => infer C ? C : never;
    }
  : never;

type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (
  x: infer R,
) => any
  ? R
  : never;

type NormalizePlugins<T> = T extends (...args: any[]) => infer R
  ? NormalizePlugins<R>
  : T extends readonly any[]
  ? T[number] extends infer R
    ? NormalizePlugins<R>
    : never
  : T extends Promise<infer R>
  ? NormalizePlugins<R>
  : T extends Plugin
  ? T
  : never;

type PluginContextFuncs = UnionToIntersection<
  GetContextFuncs<NormalizePlugins<Plugins[keyof Plugins]>>
>;

type PluginComponents = UnionToIntersection<
  GetComponents<NormalizePlugins<Plugins[keyof Plugins]>>
>;

declare module ".." {
  interface ContextFuncs extends PluginContextFuncs {}
  interface Components extends PluginComponents {}
}
