FROM public.ecr.aws/lambda/nodejs:18

# [Not-Recommended] Use these environment variables to set AWS credentials.
# The recommended way is to use the secrets mount point.
#ENV AWS_ACCESS_KEY_ID=[add your aws access key]
#ENV AWS_SECRET_ACCESS_KEY=[add your aws secret key]
#ENV AWS_REGION=[add aws region]

# Using secret mount point for AWS secrets.
RUN --mount=type=secret,id=aws,target=/root/.aws/credentials
# The aws profile to use is passed as a build time argument. Use `default`
# Defaults to the value `default` if nothing is passed.
ARG aws_profile=default

# Copying the function code over
COPY GarminConnect/* ${LAMBDA_TASK_ROOT}

# The entry handler for the lambda function
CMD [ "index.handler" ]
