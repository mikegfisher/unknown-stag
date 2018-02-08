#!/usr/bin/env bash
#watch as I switch environments in a single bound
declare -a environments=('local' 'prod')
while [[ $# -gt 1 ]]
do
key="$1"

case $key in
    -e|--environment)
    ENVIRONMENT="$2"
    shift # past argument
    ;;
    --default)
    DEFAULT=YES
    ;;
    *)

    ;;
esac
shift
done

# is -e arg in the list of environments
if [[ " ${environments[*]} " == *" $ENVIRONMENT "* ]];
then
    echo "switching to contents of .env.$ENVIRONMENT"
    cp ".env.$ENVIRONMENT" ".env"
    echo "switched to .env.$ENVIRONMENT"
else
    echo "($ENVIRONMENT) is not a valid environment argument"
fi

