import mongoose from "mongoose";
declare const logSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    timestamp: NativeDate;
    message?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    timestamp: NativeDate;
    message?: string | null | undefined;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    timestamp: NativeDate;
    message?: string | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default logSchema;
//# sourceMappingURL=logModel.d.ts.map