export const fileService = (GolemSDK: {
  TaskExecutor: {
    create: (arg0: string) => Promise<any>;
  };
}) => {
  return {
    processFile: async () => {
      console.log("Processing file...");
      const executor = await GolemSDK.TaskExecutor.create("golem/alpine:latest");
      // await executor.run(async (ctx: any) => console.log((await ctx.run("echo 'Hello World'")).stdout));
    },
  };
};
