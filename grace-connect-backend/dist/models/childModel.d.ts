import mongoose from "mongoose";
declare const childSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    records: mongoose.Types.ObjectId[];
    signedIn: boolean;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    age?: number | null | undefined;
    oneTime?: boolean | null | undefined;
    cell?: string | null | undefined;
    lastSignedIn?: string | null | undefined;
    lastSignedOut?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    records: mongoose.Types.ObjectId[];
    signedIn: boolean;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    age?: number | null | undefined;
    oneTime?: boolean | null | undefined;
    cell?: string | null | undefined;
    lastSignedIn?: string | null | undefined;
    lastSignedOut?: string | null | undefined;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    records: mongoose.Types.ObjectId[];
    signedIn: boolean;
    firstName?: string | null | undefined;
    lastName?: string | null | undefined;
    age?: number | null | undefined;
    oneTime?: boolean | null | undefined;
    cell?: string | null | undefined;
    lastSignedIn?: string | null | undefined;
    lastSignedOut?: string | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default childSchema;
//# sourceMappingURL=childModel.d.ts.map