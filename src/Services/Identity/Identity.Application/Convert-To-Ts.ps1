
$input = "C:\Users\jenki\source\app\solar-engineer\src\Services\Identity\Identity.Contracts\Responses\"
$output = "C:\Users\jenki\source\app\solar-engineer\src\WebUI\libs\auth\shared\src\lib\backend-signalr-contracts"

#$input = "C:\Users\jenki\source\app\solar-engineer\src\Services\Identity\Identity.Contracts\Responses\"
#$output = "C:\Users\jenki\source\app\solar-engineer\src\WebUI\libs\auth\shared\src\lib\backend-signalr-contracts"
dotnet-cs2ts ${input} -o ${output} -k -m -d String -n Undefined -i Simple -q Single -anl
#dotnet-cs2ts -o ./src/app/identity/models/ -t -ts 2 -se -k -m -c -a -p -pc -d String -n Null -i Simple -q Single -anl ./src/app/identity/models/identity.cs

#Options:
#-o|--output <OUTPUT>                              Output file or directory path
#-t|--use-tabs                                     Use tabs for indentation
#-ts|--tab-size <TAB_SIZE>                         Number of spaces per tab
#-se|--skip-export                                 Skip 'export' keyword
#-k|--use-kebab-case                               Use kebab case for output file names
#-m|--append-model-suffix                          Append '.model' suffix to output file names
#-c|--clear-output-directory                       Clear output directory
#-a|--angular-mode                                 Use Angular style conventions
#-p|--partial-override                             Override only part of output file between marker comments
#-pc|--preserve-casing                             Don't convert field names to camel case
#  -pip|--preserve-interface-prefix                  Don't remove interface prefixes
#-d|--convert-dates-to <CONVERT_DATES_TO>          Set output type for dates
#Allowed values are: String, Date, Union
#-n|--convert-nullables-to <CONVERT_NULLABLES_TO>  Set output type for nullables
#Allowed values are: Null, Undefined
#-i|--import-generation <IMPORT_GENERATION>        Enable import generation
#Allowed values are: None, Simple
#-q|--quotation-mark <QUOTATION_MARK>              Set quotation marks for import statements & identifiers
#Allowed values are: Double, Single
#-anl|--append-new-line                            Append new line to end of file (removes TSLint warning)
#-?|-h|--help                                      Show help information
