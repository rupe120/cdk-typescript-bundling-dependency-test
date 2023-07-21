import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as njsLambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

export class TypescriptBundleExternalStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

        // Start asset export function, without runtime specified
        const startQuicksightAssetExportFunction = new njsLambda.NodejsFunction(
          this,
          `typescript-bundle-external-dependency-test`,
          {
              functionName: `typescript-bundle-external-dependency-test`,
              entry: 'lib/typescript-bundle-external-stack-dependency-test.ts',
              tracing: lambda.Tracing.ACTIVE,
              insightsVersion: lambda.LambdaInsightsVersion.VERSION_1_0_143_0,
              timeout: cdk.Duration.minutes(1),
              environment: {
                  AWS_REGION_ID: this.region,
                  AWS_ACCOUNT_ID: this.account,
              },
              bundling: {
                  minify: false,
                  sourceMap: true,
                  externalModules: ['uuid'],
              },
          }
      );
      startQuicksightAssetExportFunction.addToRolePolicy(
          new iam.PolicyStatement({
              actions: [
                  'quicksight:StartAssetBundleExportJob',
                  'cloudformation:DescribeStacks',
                  'cloudformation:ListStackResources',
                  'tag:GetResources',
              ],
              resources: ['*'],
          })
      );
      startQuicksightAssetExportFunction.addToRolePolicy(
          new iam.PolicyStatement({
              actions: ['quicksight:List*', 'quicksight:Describe*'],
              resources: [`arn:aws:quicksight:${this.region}:${this.account}:dashboard/*`],
          })
      );
  }
}
