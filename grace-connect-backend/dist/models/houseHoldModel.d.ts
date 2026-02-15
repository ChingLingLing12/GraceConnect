import mongoose from "mongoose";
declare const houseHoldSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    children: mongoose.Types.ObjectId[];
    guardianFirstName?: string | null | undefined;
    guardianLastName?: string | null | undefined;
    email?: string | null | undefined;
    phone?: string | null | undefined;
}, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    children: mongoose.Types.ObjectId[];
    guardianFirstName?: string | null | undefined;
    guardianLastName?: string | null | undefined;
    email?: string | null | undefined;
    phone?: string | null | undefined;
}>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<{
    children: mongoose.Types.ObjectId[];
    guardianFirstName?: string | null | undefined;
    guardianLastName?: string | null | undefined;
    email?: string | null | undefined;
    phone?: string | null | undefined;
}> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export default houseHoldSchema;
//# sourceMappingURL=houseHoldModel.d.ts.map