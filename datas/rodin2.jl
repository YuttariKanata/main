using Base.GMP


@inline function is_perfect_square(x::BigInt)::Bool
    ccall((:__gmpz_perfect_square_p, Base.GMP.libgmp), Cint, (Ref{BigInt},), x) != 0
end



function build_tree(input)
    max_value_limit = BigInt(1)<<input
    stack = [(BigInt(1),BigInt(2),BigInt(5))]

    while !isempty(stack)
        (a, b, c) = pop!(stack)

        if is_perfect_square(c)
            println("\n平方数: (a, b, c) = ($a, $b, $c)")
        end

        child1_c = 3 * b * c - a
        child2_c = 3 * a * c - b

        if child1_c <= max_value_limit
            push!(stack, (b, c, child1_c))
        end
        if child2_c <= max_value_limit
            push!(stack, (a, c, child2_c))
        end
    end
end

function main(input)
    GC.gc()
    @time "\nツリー構築の実行時間: " build_tree(input)
end













