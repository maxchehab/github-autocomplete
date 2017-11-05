_git_autocomplete()
{

    local cur=${COMP_WORDS[COMP_CWORD]}
    COMPREPLY=( $(compgen -W "$(node /home/maxchehab/Projects/github-autocomplete/index.js ${COMP_WORDS[COMP_CWORD]})" -- $cur) )
    #COMPREPLY=( $(compgen -W "hello world" -- he) )

}
complete -o default -F _git_autocomplete git clone